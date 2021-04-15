const logoUrl = chrome.runtime.getURL("icon.png")
const gsLogoUrl = chrome.runtime.getURL("logo.png")
const paypalLogoUrl = chrome.runtime.getURL("paypal.png")
const openCollectiveLogoUrl = chrome.runtime.getURL("opencollective.png")
const githubLogoUrl = chrome.runtime.getURL("github.svg")
const linkedinLogoUrl = chrome.runtime.getURL("linkedin.svg")

const NEWS_FEED_CLASSNAME = "core-rail"
const SHARED_NEWS_CLASSNAME = "ad-banner-container artdeco-card ember-view"
const MAIN_CONTAINER_CLASSNAME = "scaffold-layout__content scaffold-layout__content--sidebar-main-aside"
const LINKEDIN_NEWS = "news-module pv3 ember-view"

const setMainContainerVisibility = (visible) => {
    const visibility = visible ? 'visible' : 'hidden'
    const opacity = visible ? '1' : '0'
    const mainContainer = document.getElementsByClassName(MAIN_CONTAINER_CLASSNAME)[0]
    mainContainer.style.visibility = visibility
    mainContainer.style.opacity = opacity
}

const setupMainContainer = () => {
    setMainContainerVisibility(false)
    const mainContainer = document.getElementsByClassName(MAIN_CONTAINER_CLASSNAME)[0]
    mainContainer.style.opacity = "0"
    mainContainer.style.transition = "opacity 0.4s ease-out"
}

setupMainContainer()
var intervalTimerId;
var distractionsHidden = false;

/**
 * Our content script can interact with the DOM, so we register a listener
 * that hides the news feed and side news panel when the 'focus' message
 * is sent by the background script.
 */
const port = chrome.runtime.connect({ name: "linkedin-focus" });
port.onMessage.addListener((msg) => {
    if (msg.type === "focus") {
        enterFocusMode()
    } else if (msg.type === "unfocus") {
        hideDistractions(false)
    } else if (msg.type === "reset") {
        console.log("Resetting")
        distractionsHidden = false;
    }
});

const tryHidingDistractions = () => {
    if (distractionsHidden) {
        console.log("News is blocked")
        clearInterval(intervalTimerId)
    } else {
        hideDistractions(true)
    }
}

const enterFocusMode = () => {
    if (hasNewsLoaded()) {
        console.log("News has loaded")
        hideDistractions(true)
    } else {
        console.log("News hasn't loaded.")
        intervalTimerId = setInterval(tryHidingDistractions, 343)
    }
}

const displayQuote = () => {
    var quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0].style.visibility = 'visible'

    const quoteStyle = "style=\"color:#293E4A;font-size:24px;\margin-bottom:4px;\""
    const lfTitleStyle = "style=\"color:#0073b1;font-size:32px;font-weight:700;margin-bottom:16px;\""
    const gsTitleStyle = "style=\"color:#434343;font-size:32px;font-weight:700;margin-right:auto;\""
    const gsSocialStyle = "<style>.social-link {height: 32px;margin: 0px 6px;}</style>"
    const quoteSourceStyle = "style=\"color:#293E4A;font-size:20px;font-style:italic;margin-bottom:16px;\""
    const instructionStyle = "style=\"color:#293E4A;font-size:16px;\margin-bottom:4px;\""
    const logoStyle = " style=\"height: 24px;margin: 0px 4px;\" "
    const hyperlinkStyle = "<style>a{text-decoration: none;color: black;} a:visited{text-decoration: none;color: black;} a:hover{text-decoration: none !important;opacity: 0.7;} </style>"
    const paypalButtonStyle = "<style>.paypal-icon{height:24px;margin-right:4px}.paypal-button{margin-right:24px;border-radius:24px;height:42px;border:1px solid #003084;outline:none;display:flex;align-items:center;padding:2px 16px;color:#003084;font-size:18px;background-color:white;transition:all 0.3s ease-out}.paypal-button:hover{cursor:pointer;border:1px solid #1ba0de}.paypal-button:active{cursor:pointer;border:1px solid #1ba0de;color:white;background-color:#003084}</style>"
    const openCollButtonStyle = "<style>.opencoll-icon{height:24px;margin-right:4px}.opencoll-button{margin-right:24px;border-radius:24px;height:42px;border:1px solid #87ADEC;outline:none;display:flex;align-items:center;padding:2px 16px;color:#87ADEC;font-size:18px;background-color:white;transition:all 0.3s ease-out}.opencoll-button:hover{cursor:pointer;border:1px solid #1ba0de}.opencoll-button:active{cursor:pointer;border:1px solid #1ba0de;color:#87ADEC;background-color:#87ADEC}</style>"    
    const sponsorButtonStyle = "<style>.btn-github-sponsors {color: #24292e;background-color: #fafbfc;border-color: rgba(27, 31, 35, 0.15) !important;box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),inset 0 1px 0 hsla(0, 0%, 100%, 0.25);transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);padding: 5px 16px;font-size: 14px;font-weight: 500;line-height: 20px;white-space: nowrap;;cursor: pointer;user-select: none;border: 1px solid;border-radius: 6px;appearance: none;font-family: BlinkMacSystemFont, Segoe UI, Helvetica, Arial; background-color: #f3f4f6;transition-duration: 0.1s;} .icon-github-sponsors {margin-right: 8px;vertical-align: text-bottom;}</style>"
    const gsDesc = "This web extension was developed by Grey Software, a not-for-profit open source software development academy where maintainers and students create free software."
    const instruction = "To exit focus mode, click on the LinkedInFocus extension:"
    const gsDonate = "You can support us as we envision and build the software ecosystem of the future by sponsoring us on GitHub and/or by making a donation via PayPal."
    const gsThankYou = "Thank you for your generosity and support 🙂"

    var focusHTML = "<h1 " + lfTitleStyle + ">LinkedInFocus</h1>"
    focusHTML += hyperlinkStyle
    focusHTML += "<p " + quoteStyle + ">" + quote.text + "</p>"
    focusHTML += "<p " + quoteSourceStyle + ">- " + quote.source + "</p>"
    focusHTML += "<p " + instructionStyle + ">" + instruction
    focusHTML += "<img src=\"" + logoUrl + "\" " + logoStyle + ">" + " from the extensions panel on the top right corner of your screen.</p>"
    focusHTML += "<br>"

    focusHTML += "<div style=\"border: 2px;border-style:solid;border-color:#434343;padding: 0.96em;width: 535px;height: 369px;margin-top: 16px;padding-top:20px;border-radius:4px;\">"
    focusHTML += "<div style=\"display: flex; align-items: center;margin-bottom:16px;justify-content:space-between\">"
    
    focusHTML += "<div style=\"display: flex;align-items:center;\">"
    focusHTML += "<img src=\"" + gsLogoUrl + "\" style=\"height: 50px;float:left;margin-right: 6px;\" />"
    focusHTML += "<span><a target=\"_blank\" href=\"https://www.grey.software\"" + gsTitleStyle + ">Grey Software</a></span>"
    focusHTML += "</div>"
    
    focusHTML += gsSocialStyle
    focusHTML += "<div>"
    focusHTML += "<a target=\"_blank\" href=\"https://www.linkedin.com/company/grey-software/\"><img class=\"social-link\" src=\"" + linkedinLogoUrl + "\" /></a>"
    focusHTML += "<a target=\"_blank\" href=\"https://github.com/grey-software\"><img class=\"social-link\" src=\"" + githubLogoUrl + "\" /></a>"
    focusHTML += "</div>"
    focusHTML += "</div>"

    focusHTML += "<div>" + gsDesc + "</div>"
    focusHTML += "<div style=\"margin: 12px 0px;\">" + gsDonate + "</div>"
    focusHTML += "<div style=\"margin-bottom: 12px;\">" + gsThankYou + "</div>"
    focusHTML += paypalButtonStyle
    focusHTML += openCollButtonStyle
    focusHTML += sponsorButtonStyle
    focusHTML += "<div style=\"display:flex;align-items:center\">"
    focusHTML += "<a target=\"_blank\" href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VEAGAZP7DHJNE&source=url\"><button class=\"paypal-button\"><img class=\"paypal-icon\" src=\"" + paypalLogoUrl + "\"/>Donate</button></a>"
    focusHTML += "<a target=\"_blank\" href=\"https://opencollective.com/grey-software\"><button class=\"opencoll-button\"><img class=\"opencoll-icon\" src=\"" + openCollectiveLogoUrl + "\"/>Donate</button></a>"
    focusHTML += "<a target=\"_blank\" href=\"https://github.com/sponsors/grey-software\" class=\"btn-github-sponsors\"><svg class=\"icon-github-sponsors\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" fill=\"#ea4aaa\" d=\"M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z\"></path></svg><span>Sponsor</span></a>"
    focusHTML += "</div>"

    const quoteHtmlNode = document.createElement("div")

    const parser = new DOMParser()
    const parsed = parser.parseFromString(focusHTML, `text/html`)
    const tags = parsed.getElementsByTagName(`body`)

    quoteHtmlNode.innerHTML = ``
    for (const tag of tags) {
        quoteHtmlNode.appendChild(tag)
    }

    document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0].prepend(quoteHtmlNode)
    document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0].style.fontFamily = "Arial, Helvetica";
}

const hideDistractions = (shouldHide) => {
    const newsFeedContainer = document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0]
    try {
        if (shouldHide) {
            document.getElementsByClassName(SHARED_NEWS_CLASSNAME)[0].style.visibility = 'hidden'
            for (let i = 0; i < newsFeedContainer.children.length; i++) {
                newsFeedContainer.children[i].style.visibility = 'hidden';
            }
            document.getElementsByClassName('ad-banner-container is-header-zone ember-view')[0].style.visibility = 'hidden'
            document.getElementsByClassName(LINKEDIN_NEWS)[0].style.visibility = 'hidden'
            displayQuote()
            setTimeout(() => {
                document.getElementsByClassName(MAIN_CONTAINER_CLASSNAME)[0].style.opacity = "1"
            }, 148)
        } else {
            document.getElementsByClassName(SHARED_NEWS_CLASSNAME)[0].style.visibility = 'visible'
            document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0].children[0].remove()
            for (let i = 0; i < newsFeedContainer.children.length; i++) {
                newsFeedContainer.children[i].style.visibility = 'visible';
            }
            document.getElementsByClassName('ad-banner-container is-header-zone ember-view')[0].style.visibility = 'visible'
            document.getElementsByClassName(LINKEDIN_NEWS)[0].style.visibility = 'visible'
        }
        distractionsHidden = shouldHide
    } catch (e) {
        console.log("Element not loaded: " + e)
        console.log(e)
    } finally {
        setMainContainerVisibility(true)
    }
}

const hasNewsLoaded = () => {
    return document.getElementsByClassName(SHARED_NEWS_CLASSNAME)[0] && document.getElementsByClassName(NEWS_FEED_CLASSNAME)[0]
}
