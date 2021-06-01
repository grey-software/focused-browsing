(()=>{var e={565:(e,t,i)=>{"use strict";function r(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}i.d(t,{Z:()=>a});var n=i(761),a=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.PANEL_ELEMENTS=[],this.TWITTER_FEED_CHILD_NODE=null,this.feedIntervalId=0,this.pageInterval=0,this.initialLoad=!1,this.TWITTER_FEED_FRAME_HEIGHT="1000px",this.TWITTER_FEED_FRAME_WIDTH="598px",this.TWITTER_PANEL_FRAME_HEIGHT="4000px",this.TWITTER_PANEL_FRAME_WIDTH="350px",this.IFRAME_ClASS="focus-card";var t=this.initIframeTwitter();this.feedIframe=t[0],this.panelIframe=t[1]}var t,i,a;return t=e,(i=[{key:"initIframeTwitter",value:function(){var e=document.createElement("iframe"),t=document.createElement("iframe");return e.width=this.TWITTER_FEED_FRAME_WIDTH,e.height=this.TWITTER_FEED_FRAME_HEIGHT,e.className=this.IFRAME_ClASS,t.width=this.TWITTER_PANEL_FRAME_WIDTH,t.height=this.TWITTER_PANEL_FRAME_HEIGHT,t.className=this.IFRAME_ClASS,Object.assign(e.style,{position:"fixed",border:"none"}),Object.assign(t.style,{position:"fixed",border:"none"}),[e,t]}},{key:"clearPanelElements",value:function(){this.PANEL_ELEMENTS=[]}},{key:"focusTwitterPanel",value:function(){this.pageInterval=setInterval(this.tryBlockingTwitterPanel.bind(this),700)}},{key:"setFeedIframeSource",value:function(){"rgb(0, 0, 0)"==document.body.style.backgroundColor?this.feedIframe.src=chrome.runtime.getURL("www/twitter/feed/twitterFeedDark.html"):"rgb(21, 32, 43)"==document.body.style.backgroundColor?this.feedIframe.src=chrome.runtime.getURL("www/twitter/feed/twitterFeedDim.html"):this.feedIframe.src=chrome.runtime.getURL("www/twitter/feed/twitterFeed.html")}},{key:"setPanelIframeSource",value:function(){"rgb(0, 0, 0)"==document.body.style.backgroundColor||"rgb(21, 32, 43)"==document.body.style.backgroundColor?this.panelIframe.src=chrome.runtime.getURL("www/twitter/panel/twitterPanelDark.html"):this.panelIframe.src=chrome.runtime.getURL("www/twitter/panel/twitterPanel.html")}},{key:"focusTwitter",value:function(){this.initialLoad?this.feedIntervalId=setInterval(this.tryBlockingTwitterHome.bind(this),100):(this.feedIntervalId=setInterval(this.tryBlockingTwitterHome.bind(this),500),this.initialLoad=!this.initialLoad)}},{key:"toggleTwitterHomeDistractions",value:function(e){try{e?(this.hideTwitterFeed(!0),this.hideTwitterPanel(!0),this.injectCards("home")):(this.hideTwitterFeed(!1),this.hideTwitterPanel(!1))}catch(e){}}},{key:"hideTwitterFeed",value:function(e){var t=n.getTwitterFeed();e?(this.TWITTER_FEED_CHILD_NODE=t.children[0],t.removeChild(t.childNodes[0])):t.append(this.TWITTER_FEED_CHILD_NODE)}},{key:"hideTwitterPanel",value:function(e){var t=n.getTwitterPanel();if(e){for(var i=t.children.length;1!=i;){var r=t.lastChild;this.PANEL_ELEMENTS.push(r),t.removeChild(r),i-=1}this.injectCards("panel")}else{for(var a=0;a<this.PANEL_ELEMENTS.length;a+=1)t.append(this.PANEL_ELEMENTS[a]);this.clearPanelElements()}}},{key:"tryBlockingTwitterHome",value:function(){if(this.distractionsHidden("home"))return clearInterval(this.feedIntervalId),void(this.initialLoad=!1);try{n.homePageTwitterHasLoaded()&&this.toggleTwitterHomeDistractions(!0)}catch(e){}}},{key:"tryBlockingTwitterPanel",value:function(){if(this.distractionsHidden("panel"))clearInterval(this.pageInterval);else try{n.hasTwitterPanelLoaded()&&this.hideTwitterPanel(!0)}catch(e){}}},{key:"distractionsHidden",value:function(e){try{var t=n.getTwitterPanel();return"home"==e?"IFRAME"==n.getTwitterFeed().children[0].nodeName&&2==t.children.length:2==t.children.length}catch(e){}}},{key:"injectCards",value:function(e){this.setPanelIframeSource(),"home"==e&&(this.setFeedIframeSource(),n.getTwitterFeed().append(this.feedIframe)),n.getTwitterPanel().append(this.panelIframe)}}])&&r(t.prototype,i),a&&r(t,a),e}()},761:e=>{function t(){return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[0].children[0].children[3]}function i(){return document.querySelectorAll('[role="main"]')[0].children[0].children[0].children[0].children[1].children[0].children[1].children[0].children[0].children[0]}e.exports={homePageTwitterHasLoaded:function(){return i()&&t()},getTwitterFeedClassName:function(){var e=t();if(null!=e)return e.className;throw"feed class name not found!"},hasTwitterPanelLoaded:function(){var e=i();return 5==e.children.length||2==e.children.length},getTwitterPanel:i,getTwitterFeed:t}}},t={};function i(r){var n=t[r];if(void 0!==n)return n.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,i),a.exports}i.d=(e,t)=>{for(var r in t)i.o(t,r)&&!i.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e,t=i(565);function r(t){var i=t.status,r=t.method,a=t.url;"focus"==i?a.includes("twitter")&&(e.clearPanelElements(),"initial"==r?e.focusTwitter():"hidePanels"==r?e.focusTwitterPanel():e.toggleTwitterHomeDistractions(!0)):"unfocus"==t.status&&a.includes("twitter")&&(a.includes("/home")?(n(),e.toggleTwitterHomeDistractions(!1)):e.hideTwitterPanel(!1),n())}function n(){try{var e=document.getElementsByClassName("focus-card");Array.prototype.forEach.call(e,(function(e){e.remove()}))}catch(e){console.log("the iframe is not on the screen")}}chrome.runtime.connect({name:"Focused Browsing"}).onMessage.addListener(r),e=new t.Z})()})();