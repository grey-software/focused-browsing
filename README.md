# Focused Browsing 

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
- **Keyboard Shortcuts**: `LShift + RShift` to quickly toggle focus mode
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
