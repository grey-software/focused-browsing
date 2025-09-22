# Focused Browsing (buyao) 🎯

> A web extension that helps you reclaim your focus by hiding distracting feeds on popular social websites.

[![Chrome Users](https://img.shields.io/badge/dynamic/json?color=blue&label=chrome%20users&query=users&suffix=%20users&url=https%3A%2F%2Fchrome-extension-stats.vercel.app%2Fapi%2Fextensions%2Focbkghddheomencfpdiblibbjhjcojna)](https://chrome.google.com/webstore/detail/ocbkghddheomencfpdiblibbjhjcojna)
[![Chrome Rating](https://img.shields.io/badge/dynamic/json?color=green&label=rating&query=rating&suffix=%2F5&url=https%3A%2F%2Fchrome-extension-stats.vercel.app%2Fapi%2Fextensions%2Focbkghddheomencfpdiblibbjhjcojna)](https://chrome.google.com/webstore/detail/ocbkghddheomencfpdiblibbjhjcojna)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<div align="center">
  <img alt="Focused Browsing Extension" width="600" src="https://grey.software/focused-browsing/promo.png">
</div>

> ⚠️ [We develop buyao on Gitlab](https://gitlab.com/grey-software/focused-browsing) and host an up-to-date mirror repo on Github

## ✨ What is Focused Browsing?

Focused Browsing (buyao) helps professionals and creators maintain productivity by intelligently hiding distracting content on social media and professional networking sites. Instead of blocking entire websites, it removes the addictive feeds while preserving the core functionality you need.

## 🚀 Key Features

### 🎯 **Smart Content Filtering**
- **LinkedIn**: Hide news feeds, promoted posts, and ads while keeping professional features
- **YouTube**: Remove recommended videos, comments, and suggestions while preserving video functionality
- **Twitter**: Filter distracting timeline content (legacy support)
- **GitHub**: Minimize social distractions on the development platform

### ⚡ **Instant Control**
- **One-Click Toggle**: Switch between focused and normal modes without leaving your tab
- **Keyboard Shortcuts**: `Shift + F + B` to quickly toggle focus mode
- **Per-Site Control**: Enable/disable the extension for specific websites independently

### 🎨 **Customizable Experience**
- **Inspirational Quotes**: Replace distracting content with motivational quotes
- **Flexible Text Sizes**: Adjust quote text size to your preference
- **Theme Integration**: Seamlessly works with dark/light modes on supported sites

### 🔧 **Smart State Management**
- **Persistent Preferences**: Your settings are saved across browser sessions
- **Dynamic Loading**: Handles modern single-page applications with content that loads dynamically
- **Graceful Degradation**: Works reliably even when websites update their layouts

## 📦 Installation

### For Users

#### Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/ocbkghddheomencfpdiblibbjhjcojna)
2. Click "Add to Chrome"
3. Confirm by clicking "Add Extension"

#### Manual Installation
1. Download the latest release from [Releases](https://github.com/grey-software/focused-browsing/releases)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (top right toggle)
5. Click "Load unpacked" and select the extracted folder

### For Developers

```bash
# Clone the repository
git clone https://github.com/grey-software/focused-browsing.git
cd focused-browsing

# Install dependencies
pnpm install

# Build the extension
pnpm build

# For development with auto-rebuild
pnpm dev
```

Then load the `extension-build` folder in Chrome as an unpacked extension.

## 🎮 How to Use

### Getting Started
1. **Install** the extension from the Chrome Web Store
2. **Navigate** to LinkedIn, YouTube, or other supported sites
3. **Click** the extension icon in your browser toolbar
4. **Toggle** individual sites on/off or customize quote settings

### Quick Controls
- **Extension Popup**: Click the icon to access per-site toggles and settings
- **Keyboard Shortcut**: Press `Shift + F + B` to instantly toggle focus mode
- **Context Menu**: Right-click for additional options (where available)

### Settings Explained
- **Website Toggles**: Enable/disable the extension for specific sites
- **Show Quotes**: Replace hidden content with inspirational messages
- **Text Size**: Adjust quote font size (small, medium, large)

## 🏗️ Architecture

Focused Browsing is built as a modern Manifest V3 browser extension with TypeScript:

- **Background Service Worker**: Manages extension lifecycle and tab communication
- **Content Scripts**: Site-specific controllers that manipulate page content
- **Popup Interface**: User-friendly settings and controls
- **State Management**: Persistent storage with real-time synchronization

For detailed technical information, see our [Code Walkthrough](./code-walkthrough.md).

## 🌐 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_24x24.png) **Chrome** | ✅ Fully Supported | Recommended browser |
| ![Brave](https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_24x24.png) **Brave** | ✅ Fully Supported | Chromium-based |
| ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_24x24.png) **Edge** | ✅ Fully Supported | Chromium-based |
| ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_24x24.png) **Firefox** | ⚠️ Not Currently Supported | Manifest V3 differences |

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Quick Start for Contributors
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/focused-browsing.git
cd focused-browsing

# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Run tests
pnpm test

# Format code
pnpm format
```

### Ways to Contribute
- 🐛 **Report bugs** via GitHub Issues
- 💡 **Suggest features** or improvements
- 🛠️ **Fix issues** and submit pull requests
- 📚 **Improve documentation**
- 🌍 **Add support** for new websites
- 🧪 **Write tests** for better coverage

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style (Prettier configured)
- Add tests for new features
- Update documentation for user-facing changes
- Test across multiple websites and scenarios

## 🐛 Troubleshooting

### Common Issues

**Extension not working on a site?**
- Check if the site is supported (LinkedIn, YouTube, etc.)
- Ensure the extension is enabled for that specific site in the popup
- Try refreshing the page after enabling

**Keyboard shortcut not working?**
- Make sure you're on a supported website
- Check that the extension is enabled for the current site
- Verify no other extension is using the same shortcut

**Content not hiding properly?**
- The website may have updated their layout - please report this as an issue
- Try disabling and re-enabling the extension for that site
- Clear browser cache and cookies if problems persist

### Getting Help
1. Check our [Issues](https://github.com/grey-software/focused-browsing/issues) for known problems
2. Search existing issues before creating new ones
3. Include your browser version, OS, and steps to reproduce
4. Screenshots or screen recordings are very helpful

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Inspiration
This project was originally inspired by [News Feed Eradicator for Facebook](https://github.com/jordwest/news-feed-eradicator) by Jordan West. We're grateful for the MIT license that allowed us to learn from and build upon that foundation.

### Community
- Thanks to all our users who provide feedback and bug reports
- Appreciation for the open-source community and the tools that make this possible
- Special thanks to contributors who have helped improve the extension

## 🔗 Links

- **Chrome Web Store**: [Install Focused Browsing](https://chrome.google.com/webstore/detail/ocbkghddheomencfpdiblibbjhjcojna)
- **Website**: [grey.software/focused-browsing](https://grey.software/focused-browsing)
- **Support**: [GitHub Issues](https://github.com/grey-software/focused-browsing/issues)
- **Discussions**: [GitHub Discussions](https://github.com/grey-software/focused-browsing/discussions)

---

<div align="center">
  <strong>Focus on what matters. Let Focused Browsing handle the distractions.</strong>
</div>
