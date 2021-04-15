var port;
var focus = true;

chrome.runtime.onConnect.addListener(function (connectionPort) {
    console.assert(connectionPort.name == "linkedin-focus");
    port = connectionPort
    port.postMessage({ type: "focus" })
});

chrome.browserAction.onClicked.addListener(function () {
    if (!focus) {
        port.postMessage({ type: "focus" })
    } else {
        port.postMessage({ type: "unfocus" })
    } focus = !focus;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!port) {
        return
    }
    if (changeInfo.url) {
        if (changeInfo.url.includes("linkedin.com/feed")) {
            if (focus) {
                port.postMessage({ type: "focus" })
            }
        } else {
            port.postMessage({ type: "reset" })
        }
    }
});
