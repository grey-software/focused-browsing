# How To Refresh Page Snapshots

Use this guide to update the three HTML files in `tests/page-snapshots`.

## Before you start

1. Open MS Edge With the AKB Profile which has claude chrome extension
2. The page should already be logged in

## Snapshot targets

1. LinkedIn home feed -> `tests/page-snapshots/linkedin-home.html`
2. YouTube home page -> `tests/page-snapshots/youtube-home.html`
3. YouTube watch page -> `tests/page-snapshots/youtube-watch.html`

## Capture steps (repeat per target page)

1. Open the target page while logged in.
2. Wait until the page fully loads.
3. Open DevTools Console.
4. Run:

```js
copy(document.documentElement.outerHTML)
```

5. Replace the matching file with the copied HTML.
6. Remove obvious personal data (names, message text, email, profile IDs) if present.

## Quick save on macOS terminal

After running `copy(...)`, you can write clipboard contents directly:

```bash
pbpaste > tests/page-snapshots/linkedin-home.html
```

Use the corresponding output file for each page.

## Validate

Run:

```bash
npm run test:selectors
```

Expected:
- Test passes.
- `reports/selector-health/selector-health-report.json` is regenerated.

## Commit checklist

1. Only snapshot files changed (plus optional docs).
2. No secrets, cookies, or access tokens in HTML.
3. Selector test passes.
