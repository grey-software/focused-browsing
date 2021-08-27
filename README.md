#### A web extension that helps you reclaim your focus by hiding distracting feeds on popular social websites.

<div align="center">
  <a href="https://org.grey.software/focused-browsing" target="_blank">
    <img alt="Focused Browsing Icon" height="420" src="https://org.grey.software/focused-browsing/promo.png">
  </a>
</div>

## Project Status

This project is currently being maintained by [Arsala](https://gitlab.com/ArsalaBangash),
[Avi](https://gitlab.com/daveavi), and [Raj](https://gitlab.com/teccUI).

## Developing Focused Browsing

### 1. Clone the repo and enter the directory

```
git clone https://github.com/grey-software/focused-browsing.git
cd focused-browsing
```

or

```
git clone https://gitlab.com/grey-software/focused-browsing.git
cd focused-browsing
```

### 2. Install Dependencies

```
yarn
```

### 3. Run the development script

```
yarn dev
```

Our development script builds the extension into the `extension-build` folder and actively watches for changes to the
source code.

### 4. Load the extension on your browser

At the moment, Focused Browsing is only compatible with Google Chrome or Brave Browser.

The image below from the [chrome documentation](https://developer.chrome.com/docs/extensions/mv3/getstarted/), shows how
to load an unpublished extension using developer mode.

<br/>
<img width="1157" alt="Screen Shot 2021-05-31 at 2 08 10 PM" src="https://user-images.githubusercontent.com/20130700/120519269-6add3e00-c3a0-11eb-9359-ac43efd68733.png">
<br/>

### 5. Reload the extension when you change a file

<br/>
<img width="1157" alt="Screen Shot 2021-05-31 at 2 08 10 PM" src=https://user-images.githubusercontent.com/20130700/120519885-27cf9a80-c3a1-11eb-9c82-4fd3fccadf69.png>

## Compatibility Chart

### Legend

**✅ Passed** **❗️Unsupported** **❓Untested**

| Operating System | ![Brave](https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_24x24.png) | ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_24x24.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_24x24.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_24x24.png) |
| ---------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| OSX 11.4 (20F71) | 1.26.74 ✅                                                                                       | 91.0.4472.114 ✅                                                                                    | ❗️                                                                                                    | ❓                                                                                            |

## Credits and Gratitude

### News Feed Eradicator by Jordan West

Focused Browsing originally started as two separate student projects called Twitter Focus and LinkedIn Focus. Both of
these were inspired by [News Feed Eradicator for Facebook](News Feed Eradicator for Facebook).

We are sincerely grateful to Jordan for
[using the MIT license for NFE](https://github.com/jordwest/news-feed-eradicator). This allowed us to learn from certain
aspects of his codebase, and allowed us to use his collection of quotes for our prototypes.

### The open source ecosystem

All software stands upon the foundations laid by the open source world.

We are where we are because of the time, energy, and passion of open source software developers around the world.

We are sincerely grateful for our access to tools that help us create better software.

## Features

### Show & Hide distractions without leaving the tab you're on.

We want to empower you to focus when you want to, but we also don't want to make it tedious for you when you want to
browse what's happening on the Internet.

That is why we made it easy for you to hide and bring back feeds without leaving your tab.

<div align="center">
  <img alt="Screenshot showcasing hiding distractions without leaving the tab you're on" height="420" src="https://org.grey.software/focused-browsing/screenshot-1.png">
</div>

### Control Distractions using keyboard shortcuts

We added keyboard shortcuts to make it seamless and intuitive for you to toggle distractions on our supported websites.

`Shift + F + B` currently toggles all distractions, and we are thinking of other shortcuts to help optimize &
personalize your experience.

<div align="center">
  <img alt="Screenshot showcasing controlling focus using keyboard shortcuts" height="420" src="https://org.grey.software/focused-browsing/screenshot-2.png">
</div>

### We support Dim and Dark modes

We added dim and dark mode support for Twitter because we wanted our extension to fit seamlessly with someone's browsing
experience on the site.

<div align="center">
  <img alt="Screenshot showcasing Dim and Dark mode support" height="420" src="https://org.grey.software/focused-browsing/screenshot-3.png">
</div>

## The Story

Professionals and creators on the Internet are drowning in information.

This hinders them from doing their best work because their ability to focus is affected by the content and news on their
feed.

Currently, platforms like LinkedIn and Twitter do not allow their users to hide their news and content feeds.

But what if we offered them a way to regain control over the feeds they did or did not want to consume?

Other extensions on the market were helpful but lacked the kind of user experience our team was looking for.

That's why we're building Focused Browsing!
