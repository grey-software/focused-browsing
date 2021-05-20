/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/background.js":
/*!******************************!*\
  !*** ./src/js/background.js ***!
  \******************************/
/***/ (() => {

var focusMode = {
  "twitter": {
    "focus": true,
    "initialized": false
  },
  "linkedin": {
    "focus": true,
    "initialized": false
  }
};
var activeURL;
var linkedinport;
chrome.runtime.onConnect.addListener(function (connectionPort) {
  console.assert(connectionPort.name == "Focused Browsing");
  port = connectionPort;
  console.log(connectionPort);
  port.onMessage.addListener(function (msg) {
    console.log("here");
    console.log(msg);
    activeURL = msg.url;

    if (isURLTwitterHome(activeURL)) {
      console.log("here about to initalize twitter");
      initializeFocus("twitter");
    } else if (activeURL === "https://www.linkedin.com/feed/") {
      initializeFocus("linkedin");
      console.log("here about to initalize linkedIn");
    }
  });
}); // chrome.tabs.onActivated.addListener(function(activeInfo, tab) {
//   chrome.tabs.getSelected(null,function(tab) {
//     activeURL = tab.url;
//     console.log("activeURL is: "+ activeURL)
//   });
// });

function tabListener(tabId, changeInfo, tab) {
  var url = tab.url;

  if (changeInfo && changeInfo.status === "complete" && url != activeURL) {
    if (url.includes("twitter.com")) {
      if (focusMode["twitter"].focus) {
        if (isURLTwitterHome(url) & !isURLTwitterHome(activeURL)) {
          console.log(url);
          console.log(activeURL);
          sendStatus("twitter", "focus", "initial");
        } else {
          sendStatus("twitter", "focus", "removeIframe");
        }

        activeURL = url;
      }
    } else if (url.includes("linkedin.com")) {
      if (focusMode["linkedin"].focus) {
        sendStatus("linkedin", "focus", "tab");
      }
    }
  }
}

chrome.tabs.onUpdated.addListener(tabListener);

function isURLTwitterHome(url) {
  return url === "https://twitter.com/home" || url === "https://twitter.com/";
}

function toggleFocusListener(command, tab) {
  chrome.tabs.get(tab.id, function (tab) {
    activeURL = tab.url;
    console.log(command);

    if (isURLTwitterHome(activeURL)) {
      console.log("sending message to twitter");
      toggleFocus("twitter");
    } else if (activeURL === "https://www.linkedin.com/feed/") {
      console.log("sending message to linkedin");
      toggleFocus("linkedin");
    }
  });
}

chrome.commands.onCommand.addListener(toggleFocusListener);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  activeURL = sender.tab.url;
  var webPage = activeURL.includes("twitter.com") ? "twitter" : "linkedin";

  if (request.status == "focus") {
    toggleFocus(webPage);
  }

  sendResponse({
    enabled: "focus"
  });
  return true;
});

function toggleFocus(webPage) {
  if (!focusMode[webPage].focus) {
    console.log("focus mode on " + webPage);
    sendStatus(webPage, "focus", "toggle");
  } else {
    console.log("unfocus mode on " + webPage);
    sendStatus(webPage, "unfocus", "toggle");
  }

  focusMode[webPage].focus = !focusMode[webPage].focus;
}

function sendStatus(webPage, status, method) {
  try {
    console.log("sending status " + status + " on " + webPage); // port.postMessage({"status":status, "method": method})

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      var url = tabs[0].url;
      chrome.tabs.sendMessage(tabs[0].id, {
        "url": url,
        "status": status,
        "method": method
      }, function (response) {
        console.log(response.farewell);
      });
    });
  } catch (err) {
    console.log("background script hasn't initialized port");
  }
}

function initializeFocus(webPage) {
  var initializeFocus = !focusMode[webPage].initialized || focusMode[webPage].focus;

  if (initializeFocus) {
    console.log("initializing focus");
    sendStatus(webPage, "focus", "initial");
    console.log(focusMode);
  }

  if (!focusMode[webPage].initialized) {
    focusMode[webPage].initialized = !focusMode[webPage].initialized;
    console.log(focusMode);
  }
}

/***/ }),

/***/ "./src/sass/card.scss":
/*!****************************!*\
  !*** ./src/sass/card.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/dist/js/background": 0,
/******/ 			"dist/css/card": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["dist/css/card"], () => (__webpack_require__("./src/js/background.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["dist/css/card"], () => (__webpack_require__("./src/sass/card.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;