# Focused Browsing

A browser extension that hides distracting content on LinkedIn and YouTube, letting you use these sites productively without getting pulled into endless scrolling.

## What it does

Instead of blocking entire websites, Focused Browsing selectively hides the parts that waste your time while keeping the parts you actually need.

### LinkedIn
- **Full focus mode**: Hides the feed and side panels (news, trending, "Add to your feed"). Replaces the feed with an inspirational quote.
- **Custom focus mode**: Hides only the side panels while keeping the main feed visible. Useful when you want to browse your feed without sidebar distractions.

### YouTube
- **Focus mode**: Hides recommended videos, comments, and suggestions while preserving video playback.

## How to use it

### Toggle focus mode
Press **Left Shift + Right Shift** on any supported site to cycle through focus modes.

With custom focus enabled for LinkedIn, the cycle is:
**Full Focus** → **Custom Focus** → **Unfocused** → **Full Focus**

Without custom focus, it toggles between **Full Focus** and **Unfocused**.

### Extension popup
Click the extension icon to access settings:
- **LinkedIn** / **YouTube** toggles: Enable or disable the extension per site
- **Custom focus** (under LinkedIn): Enable the custom focus mode that hides only side panels
- **Show inspirational quotes**: Toggle motivational quotes that replace hidden feeds
- **Text size**: Adjust quote text size (S / M / L / XL)

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
- Make sure the site is enabled in the popup
- Try refreshing the page after enabling a site

**Keyboard shortcut not working?**
- Confirm you're on a supported site with the extension enabled for it

**Content not hiding?**
- Try toggling the extension off and on for that site
- The site may have updated its layout — please open an issue

## License

MIT — see [LICENSE](LICENSE) for details.

## Acknowledgments

Originally inspired by [News Feed Eradicator for Facebook](https://github.com/jordwest/news-feed-eradicator) by Jordan West.
