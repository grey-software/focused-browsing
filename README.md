# Focused Browsing

A browser extension that hides distracting content on LinkedIn, YouTube, and X, letting you use these sites productively without getting pulled into endless scrolling.

## What it does

Instead of blocking entire websites, Focused Browsing selectively hides the parts that waste your time while keeping the parts you actually need.

### Supported sites
- **LinkedIn**: Focused mode hides the feed and side panels. Unfocused mode restores the feed but still hides the side panels.
- **YouTube**: Hides recommended videos, comments, and suggestions while preserving video playback.
- **X**: Focused mode hides the home feed and sidebar. Unfocused mode restores the feed but still hides the sidebar.

## How to use it

### Toggle focus mode
Press **Left Shift + Right Shift** on any supported site to switch between **Focused** and **Unfocused**.
On LinkedIn and X, **Unfocused** still keeps the side panels hidden.

### Extension popup
Click the extension icon for a compact status view and shortcut reference.

### Settings page
Advanced controls will live on a separate extension page. The scaffold is now
part of the extension so future customization can move there without bloating
the popup.

## Installation

1. Clone this repo and run `npm install`
2. Run `npm run build`
3. Open your browser's extension page (`chrome://extensions`, `edge://extensions`, or `brave://extensions`)
4. Enable "Developer mode"
5. Click "Load unpacked" and select the `dist` folder

## Browser support

| Browser | Supported |
|---------|-----------|
| Chrome  | Yes       |
| Brave   | Yes       |
| Edge    | Yes       |
| Firefox | No (Manifest V3 differences) |

## Troubleshooting

**Extension not working?**
- Refresh the current page on a supported site

**Keyboard shortcut not working?**
- Confirm you're on a supported site

**Content not hiding?**
- Try toggling the extension off and on for that site
- The site may have updated its layout — please open an issue

## License

MIT — see [LICENSE](LICENSE) for details.

## Acknowledgments

Originally inspired by [News Feed Eradicator for Facebook](https://github.com/jordwest/news-feed-eradicator) by Jordan West.
