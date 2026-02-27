/**
 * Selector Registry — the single source of truth for which CSS selectors
 * this extension depends on, organized by website page.
 *
 * HOW IT WORKS:
 * - Each page entry lists "features" (e.g. feed container, ad panel).
 * - Each feature has an ordered list of selectors: first = preferred/primary,
 *   rest = fallbacks. The contract tests treat index 0 as "pass" and any
 *   later index as "warn" (works, but we're relying on a fallback).
 * - snapshotPaths point to saved HTML files in tests/page-snapshots/.
 *   Multiple snapshots per page let us test against different page variations
 *   (e.g. different YouTube videos).
 *
 * WHEN TO UPDATE:
 * - A selector broke → update the selector arrays in linkedin-utils or youtube-utils,
 *   re-capture a fresh snapshot, then re-run: npm run test:selectors
 * - Adding a new website → add a new entry here and a corresponding snapshot.
 *
 * See tests/page-snapshots/CAPTURE-GUIDE.md for how to capture snapshots.
 */

import {
  FEED_SELECTORS,
  PANEL_SELECTORS,
} from '../websites/linkedin/linkedin-utils'
import {
  YOUTUBE_COMMENTS_SELECTORS,
  YOUTUBE_HOME_FEED_SELECTORS,
  YOUTUBE_PANEL_SELECTORS,
  YOUTUBE_SUGGESTIONS_SELECTORS,
} from '../websites/youtube/youtube-utils'

export type SelectorFeatureSeverity = 'critical' | 'non-critical'

export interface SelectorFeatureDefinition {
  id: string
  description: string
  selectors: string[]
  minMatches: number
  severity: SelectorFeatureSeverity
}

export interface SelectorPageDefinition {
  id: string
  site: 'linkedin' | 'youtube'
  scenario: 'home' | 'watch'
  snapshotPaths: string[]
  features: SelectorFeatureDefinition[]
}

export interface SelectorThresholdConfig {
  warn: {
    maxWarningRatio: number
    maxNonCriticalFailures: number
  }
  fail: {
    maxWarningRatio: number
    maxCriticalFailures: number
    maxNonCriticalFailures: number
  }
}

// Thresholds control when selector drift causes warnings vs test failures.
// "warn" = logged but tests still pass. "fail" = tests break (CI would block).
export const selectorHealthThresholds: SelectorThresholdConfig = {
  warn: {
    maxWarningRatio: 0.2,
    maxNonCriticalFailures: 1,
  },
  fail: {
    maxWarningRatio: 0.5,
    maxCriticalFailures: 0,
    maxNonCriticalFailures: 3,
  },
}

export const selectorHealthReportPath = 'reports/selector-health/selector-health-report.json'

export const selectorRegistry: SelectorPageDefinition[] = [
  {
    id: 'linkedin-home',
    site: 'linkedin',
    scenario: 'home',
    snapshotPaths: ['tests/page-snapshots/linkedin-home.html'],
    features: [
      {
        id: 'feed-container',
        description: 'Main feed container remains queryable.',
        selectors: FEED_SELECTORS,
        minMatches: 1,
        severity: 'critical',
      },
      {
        id: 'panel-container',
        description: 'Sidebar panel remains queryable.',
        selectors: PANEL_SELECTORS,
        minMatches: 1,
        severity: 'non-critical',
      },
    ],
  },
  {
    id: 'youtube-home',
    site: 'youtube',
    scenario: 'home',
    snapshotPaths: ['tests/page-snapshots/youtube-home.html'],
    features: [
      {
        id: 'feed-container',
        description: 'Homepage feed container remains queryable.',
        selectors: YOUTUBE_HOME_FEED_SELECTORS,
        minMatches: 1,
        severity: 'critical',
      },
    ],
  },
  {
    id: 'youtube-watch',
    site: 'youtube',
    scenario: 'watch',
    snapshotPaths: ['tests/page-snapshots/youtube-watch.html'],
    features: [
      {
        id: 'suggestions-container',
        description: 'Watch-page suggestions container remains queryable.',
        selectors: YOUTUBE_SUGGESTIONS_SELECTORS,
        minMatches: 1,
        severity: 'critical',
      },
      {
        id: 'comments-container',
        description: 'Watch-page comments container remains queryable.',
        selectors: YOUTUBE_COMMENTS_SELECTORS,
        minMatches: 1,
        severity: 'critical',
      },
      {
        id: 'panel-container',
        description: 'Miniplayer panel selectors remain queryable.',
        selectors: YOUTUBE_PANEL_SELECTORS,
        minMatches: 1,
        severity: 'non-critical',
      },
    ],
  },
]
