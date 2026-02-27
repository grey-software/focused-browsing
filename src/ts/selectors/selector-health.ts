/**
 * Selector Health Evaluator — runs selectors against saved HTML snapshots
 * and produces a structured health report.
 *
 * EVALUATION LOGIC:
 * - For each feature, selectors are tried in order (first = primary, rest = fallbacks).
 * - First selector to match >= minMatches elements wins.
 * - If the primary (index 0) matched → "pass"
 * - If a fallback (index > 0) matched → "warn" (working but fragile)
 * - If nothing matched → "fail" (selector is broken)
 *
 * THRESHOLD EVALUATION:
 * - Two tiers: "warn" thresholds log messages, "fail" thresholds break the test.
 * - This lets us tolerate some fallback usage without blocking development,
 *   while still catching total selector breakage immediately.
 */

import {
  SelectorFeatureDefinition,
  SelectorFeatureSeverity,
  SelectorPageDefinition,
  SelectorThresholdConfig,
} from './selector-registry'

export type SelectorFeatureStatus = 'pass' | 'warn' | 'fail'

export interface SelectorFeatureResult {
  id: string
  description: string
  severity: SelectorFeatureSeverity
  status: SelectorFeatureStatus
  matchedSelector: string | null
  matchedCount: number
}

export interface SelectorPageResult {
  pageId: string
  site: string
  scenario: string
  status: 'pass' | 'warn' | 'fail'
  features: SelectorFeatureResult[]
}

export interface SelectorHealthSummary {
  pagesEvaluated: number
  totalFeatures: number
  passingFeatures: number
  warningFeatures: number
  failingFeatures: number
  criticalFailures: number
  nonCriticalFailures: number
  warningRatio: number
}

export interface SelectorThresholdEvaluation {
  warnings: string[]
  failures: string[]
}

export interface SelectorHealthReport {
  generatedAt: string
  thresholds: SelectorThresholdConfig
  thresholdEvaluation: SelectorThresholdEvaluation
  summary: SelectorHealthSummary
  pages: SelectorPageResult[]
}

export function evaluateFeature(
  documentRef: Document,
  feature: SelectorFeatureDefinition
): SelectorFeatureResult {
  let matchedSelector: string | null = null
  let matchedCount = 0
  let matchedSelectorIndex = -1

  feature.selectors.some((selector, index) => {
    const count = documentRef.querySelectorAll(selector).length
    if (count >= feature.minMatches) {
      matchedSelector = selector
      matchedCount = count
      matchedSelectorIndex = index
      return true
    }
    return false
  })

  if (!matchedSelector) {
    return {
      id: feature.id,
      description: feature.description,
      severity: feature.severity,
      status: 'fail',
      matchedSelector: null,
      matchedCount: 0,
    }
  }

  return {
    id: feature.id,
    description: feature.description,
    severity: feature.severity,
    status: matchedSelectorIndex === 0 ? 'pass' : 'warn',
    matchedSelector,
    matchedCount,
  }
}

export function evaluatePage(
  page: SelectorPageDefinition,
  documentRef: Document
): SelectorPageResult {
  const features = page.features.map((feature) => evaluateFeature(documentRef, feature))

  const hasFailure = features.some((feature) => feature.status === 'fail')
  const hasWarning = features.some((feature) => feature.status === 'warn')

  return {
    pageId: page.id,
    site: page.site,
    scenario: page.scenario,
    status: hasFailure ? 'fail' : hasWarning ? 'warn' : 'pass',
    features,
  }
}

export function summarizePages(pages: SelectorPageResult[]): SelectorHealthSummary {
  const features = pages.flatMap((page) => page.features)
  const totalFeatures = features.length
  const passingFeatures = features.filter((feature) => feature.status === 'pass').length
  const warningFeatures = features.filter((feature) => feature.status === 'warn').length
  const failingFeatures = features.filter((feature) => feature.status === 'fail').length

  const criticalFailures = features.filter(
    (feature) => feature.status === 'fail' && feature.severity === 'critical'
  ).length

  const nonCriticalFailures = features.filter(
    (feature) => feature.status === 'fail' && feature.severity === 'non-critical'
  ).length

  return {
    pagesEvaluated: pages.length,
    totalFeatures,
    passingFeatures,
    warningFeatures,
    failingFeatures,
    criticalFailures,
    nonCriticalFailures,
    warningRatio: totalFeatures === 0 ? 0 : warningFeatures / totalFeatures,
  }
}

export function evaluateThresholds(
  summary: SelectorHealthSummary,
  thresholds: SelectorThresholdConfig
): SelectorThresholdEvaluation {
  const warnings: string[] = []
  const failures: string[] = []

  if (summary.warningRatio > thresholds.warn.maxWarningRatio) {
    warnings.push(
      `Warning ratio ${summary.warningRatio.toFixed(3)} exceeded warn threshold ${thresholds.warn.maxWarningRatio.toFixed(3)}`
    )
  }

  if (summary.nonCriticalFailures > thresholds.warn.maxNonCriticalFailures) {
    warnings.push(
      `Non-critical failures ${summary.nonCriticalFailures} exceeded warn threshold ${thresholds.warn.maxNonCriticalFailures}`
    )
  }

  if (summary.warningRatio > thresholds.fail.maxWarningRatio) {
    failures.push(
      `Warning ratio ${summary.warningRatio.toFixed(3)} exceeded fail threshold ${thresholds.fail.maxWarningRatio.toFixed(3)}`
    )
  }

  if (summary.criticalFailures > thresholds.fail.maxCriticalFailures) {
    failures.push(
      `Critical failures ${summary.criticalFailures} exceeded fail threshold ${thresholds.fail.maxCriticalFailures}`
    )
  }

  if (summary.nonCriticalFailures > thresholds.fail.maxNonCriticalFailures) {
    failures.push(
      `Non-critical failures ${summary.nonCriticalFailures} exceeded fail threshold ${thresholds.fail.maxNonCriticalFailures}`
    )
  }

  return { warnings, failures }
}
