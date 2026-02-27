/**
 * Selector Contract Tests — the automated check that our CSS selectors
 * still work against real page HTML.
 *
 * HOW TO RUN: npm run test:selectors
 *
 * WHAT IT DOES:
 * 1. Loads each HTML snapshot from tests/page-snapshots/
 * 2. Runs every registered selector against the snapshot's DOM
 * 3. Produces a JSON report at reports/selector-health/selector-health-report.json
 * 4. Fails the test if critical selectors are broken
 *
 * WHEN TESTS FAIL:
 * - Check the JSON report to see which selectors broke
 * - Re-capture the snapshot (see tests/page-snapshots/CAPTURE-GUIDE.md)
 * - If the website changed its HTML, update the selectors in linkedin-utils or youtube-utils
 */

import {
  selectorHealthReportPath,
  selectorHealthThresholds,
  selectorRegistry,
} from './selector-registry'
import {
  SelectorHealthReport,
  evaluatePage,
  evaluateThresholds,
  summarizePages,
} from './selector-health'

declare const require: (moduleName: string) => any
declare const process: { cwd: () => string }

const fs = require('fs')
const path = require('path')

function loadSnapshotDocument(snapshotPath: string): Document {
  const absolutePath = path.resolve(process.cwd(), snapshotPath)
  const html = fs.readFileSync(absolutePath, 'utf8')
  return new DOMParser().parseFromString(html, 'text/html')
}

function writeHealthReport(report: SelectorHealthReport): void {
  const reportOutputPath = path.resolve(process.cwd(), selectorHealthReportPath)
  fs.mkdirSync(path.dirname(reportOutputPath), { recursive: true })
  fs.writeFileSync(reportOutputPath, JSON.stringify(report, null, 2))
}

describe('selector contract health', () => {
  let report: SelectorHealthReport

  beforeAll(() => {
    const pageResults = selectorRegistry.flatMap((page) =>
      page.snapshotPaths.map((snapshotPath) => {
        const documentRef = loadSnapshotDocument(snapshotPath)
        return evaluatePage(page, documentRef)
      })
    )

    const summary = summarizePages(pageResults)
    const thresholdEvaluation = evaluateThresholds(summary, selectorHealthThresholds)

    report = {
      generatedAt: new Date().toISOString(),
      thresholds: selectorHealthThresholds,
      thresholdEvaluation,
      summary,
      pages: pageResults,
    }

    writeHealthReport(report)

    if (thresholdEvaluation.warnings.length > 0) {
      console.warn('Selector health warnings:')
      thresholdEvaluation.warnings.forEach((warning) => console.warn(`- ${warning}`))
    }
  })

  test('all selector page snapshots are evaluated', () => {
    const totalSnapshots = selectorRegistry.reduce(
      (sum, page) => sum + page.snapshotPaths.length, 0
    )
    expect(report.summary.pagesEvaluated).toBe(totalSnapshots)
  })

  test('selector health fail thresholds are not exceeded', () => {
    expect(report.thresholdEvaluation.failures).toEqual([])
  })
})
