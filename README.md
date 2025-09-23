# Focused Browsing (buyao) 🎯

> A beautifully architected web extension that helps you reclaim your focus by intelligently hiding distracting feeds on social websites.

[![Chrome Users](https://img.shields.io/badge/dynamic/json?color=blue&label=chrome%20users&query=users&suffix=%20users&url=https%3A%2F%2Fchrome-extension-stats.vercel.app%2Fapi%2Fextensions%2Focbkghddheomencfpdiblibbjhjcojna)](https://chrome.google.com/webstore/detail/ocbkghddheomencfpdiblibbjhjcojna)
[![Chrome Rating](https://img.shields.io/badge/dynamic/json?color=green&label=rating&query=rating&suffix=%2F5&url=https%3A%2F%2Fchrome-extension-stats.vercel.app%2Fapi%2Fextensions%2Focbkghddheomencfpdiblibbjhjcojna)](https://chrome.google.com/webstore/detail/ocbkghddheomencfpdiblibbjhjcojna)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-30%20Passing-brightgreen)](./src)

<div align="center">
  <img alt="Focused Browsing Extension" width="600" src="https://grey.software/focused-browsing/promo.png">
</div>

> ⚠️ [We develop buyao on Gitlab](https://gitlab.com/grey-software/focused-browsing) and host an up-to-date mirror repo on Github

## ✨ What is Focused Browsing?

Focused Browsing (buyao) is a **modern, clean, and maintainable** web extension that helps professionals and creators maintain productivity by intelligently hiding distracting content on social media and professional networking sites. 

Instead of blocking entire websites, it **surgically removes** the addictive feeds while preserving the core functionality you need - all with a **beautiful, refactored codebase** that's a joy to walk through.

## 🚀 Key Features

### 🎯 **Smart Content Filtering**
- **LinkedIn**: Hide news feeds, promoted posts, and sidebar distractions while keeping professional features
- **YouTube**: Remove recommended videos, comments, and suggestions while preserving video functionality
- **Extensible Architecture**: Clean framework makes adding new websites straightforward

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
- **Dynamic Content Handling**: Uses modern MutationObserver patterns for SPA compatibility
- **Graceful Element Restoration**: Clean hide/restore using DOM child manipulation

## 🏗️ Modern Architecture

Focused Browsing showcases **clean architecture principles** with a **beautifully refactored codebase**:

### **Clean Code Principles Applied**
- ✅ **Single Responsibility**: Each class and function has one clear purpose
- ✅ **DRY (Don't Repeat Yourself)**: Universal utilities eliminate code duplication
- ✅ **Semantic Naming**: `DistractionWatcher`, `hideElementChildren`, `whenFound` callbacks
- ✅ **Consistent Patterns**: Unified child removal strategy across all websites
- ✅ **Separation of Concerns**: Clear boundaries between observation, manipulation, and business logic

### **Technical Architecture**
```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Background        │    │  Content Scripts    │    │     Popup           │
│   Service Worker    │◄──►│   (focus.js)        │    │   Interface         │
│                     │    │                     │    │                     │
│ • Tab Management    │    │ • DistractionWatcher│    │ • Settings & UI     │
│ • Script Injection  │    │ • Website Controllers│   │ • Toggle Controls   │
│ • State Sync        │    │ • Element Utils     │    │ • Real-time Sync    │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### **Website Controller Pattern**
```typescript
// Clean, semantic controller architecture
class LinkedInController extends WebsiteController {
  // Uses DistractionWatcher for observation
  // Uses element-utils for DOM manipulation
  // Semantic methods: hideElementChildren(), restoreElementChildren()
  // Consistent patterns across all websites
}
```

### **Universal Utilities Framework**
```typescript
// One set of utilities works for ALL websites
export function hideElementChildren(element: Element): Node[]
export function restoreElementChildren(element: Element, children: Node[]): void
export function clearElements(elements: any[]): void
```

## 🌐 Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_24x24.png) **Chrome** | ✅ Fully Supported | Recommended browser |
| ![Brave](https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_24x24.png) **Brave** | ✅ Fully Supported | Chromium-based |
| ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_24x24.png) **Edge** | ✅ Fully Supported | Chromium-based |
| ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_24x24.png) **Firefox** | ⚠️ Not Currently Supported | Manifest V3 differences |

## 🤝 Contributing

We welcome contributions! Our **clean, refactored codebase** makes contributing a joy.

### Quick Start for Contributors
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/focused-browsing.git
cd focused-browsing

# Install dependencies
pnpm install

# Start development mode
pnpm dev

# Run tests (30 test suites passing!)
pnpm test

# Format code
pnpm format
```

### Why Contributing is Easy Now
- ✅ **Clean Architecture**: Well-separated concerns, easy to understand
- ✅ **Universal Utilities**: Add new websites using existing DOM utilities
- ✅ **Consistent Patterns**: Same approach across all website controllers
- ✅ **Strong Typing**: TypeScript prevents common errors
- ✅ **Comprehensive Tests**: 30 passing tests ensure stability

### Ways to Contribute
- 🐛 **Report bugs** via GitHub Issues
- 💡 **Suggest features** or improvements
- 🛠️ **Fix issues** and submit pull requests
- 📚 **Improve documentation**
- 🌍 **Add support** for new websites (see [Next Steps](./next-steps.md))
- 🧪 **Write tests** for better coverage

### Development Guidelines
- Use TypeScript for all new code
- Follow existing patterns (DistractionWatcher, element-utils)
- Add tests for new features using Jest
- Update documentation for user-facing changes
- Test across multiple websites and scenarios

## 🐛 Troubleshooting

### Common Issues

**Extension not working on a site?**
- Check if the site is supported (LinkedIn, YouTube)
- Ensure the extension is enabled for that specific site in the popup
- Try refreshing the page after enabling
- Our **robust DistractionWatcher** handles most dynamic content automatically

**Keyboard shortcut not working?**
- Make sure you're on a supported website
- Check that the extension is enabled for the current site
- Verify no other extension is using the `Shift + F + B` shortcut

**Content not hiding properly?**
- Our **universal element utilities** handle most website updates gracefully
- Try disabling and re-enabling the extension for that site
- The issue may be that the website updated selectors - please report this
- Clear browser cache if problems persist

### Robust Architecture Benefits
- ✅ **MutationObserver patterns** handle dynamic content loading
- ✅ **Graceful element restoration** prevents page breakage
- ✅ **Universal utilities** work consistently across all websites
- ✅ **Strong error handling** with fallbacks for missing elements

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
