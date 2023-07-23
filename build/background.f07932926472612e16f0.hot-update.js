self["webpackHotUpdatechrome_extension_boilerplate_react"]("background",{

/***/ "./src/pages/Background/index.js":
/*!***************************************!*\
  !*** ./src/pages/Background/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");

//listener for percy snapshots
var automated_capture;

// Function to inject the dialog box into the page
function injectDialogBox(tab) {
  const tabTitle = tab.title;
  const tabID = tab.id;
  chrome.scripting.executeScript({
    target: {
      tabId: tabID
    },
    func: (tabTitle, tabID) => {
      var title = tabTitle;
      const getDialogMessage = title => {
        return `Capturing snapshot with the default tab title:${title}!`;
      };
      const dialogBox = document.createElement('div');
      dialogBox.setAttribute('style', `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #fff;
        padding: 1px;
        z-index: 9999;
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
      `);

      // Add your dialog box content here
      const content = document.createElement('div');
      content.style.flex = '1';
      const message = document.createElement('p');
      message.textContent = getDialogMessage(title);
      content.appendChild(message);

      // this is a confirm button
      // the workflow can be upgraded by including a timer to capture it automatically if not interacted

      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Confirm';
      confirmButton.addEventListener('click', () => {
        //add this to percy css if the diolog box is visible in the snapshot
        chrome.storage.local.get('snapshots', function (result) {
          var value = result.snapshots;
          console.log('Value retrieved from localStorage:', value);
          //if value is not undefined
          if (value != undefined && value[data.name] != undefined) {
            //ADVANCED - Provide an override button
            const warning = document.createElement('p');
            warning.textContent = '!!!Provide a unique snapshot name!!!';
            document.body.prepend(warning);
          } else {
            dialogBox.style.display = 'none';
            chrome.runtime.sendMessage({
              action: 'snapshot',
              name: title
            });
          }
        });
      });
      content.appendChild(confirmButton);
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        // Create and display an input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = title; // Set the initial value to the current title
        content.insertBefore(input, message); // Insert the input before the message

        // Replace the message with the input field
        content.removeChild(message);

        // Hide the "Edit" button
        editButton.style.display = 'none';

        // Create and display the "Save" button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        content.appendChild(saveButton);
        saveButton.addEventListener('click', () => {
          // Get the updated title from the input field
          title = input.value;
          // Replace the input field with the updated message
          content.removeChild(input);
          content.insertBefore(message, editButton);

          // Update the message with the updated title
          message.textContent = getDialogMessage(title);
          // Show the "Edit" button again
          editButton.style.display = 'block';

          // Remove the "Save" button
          content.removeChild(saveButton);
        });
      });
      content.appendChild(editButton);
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.addEventListener('click', () => {
        dialogBox.style.display = 'none';
        //should stop the capture timer here, and prevent screencapture
      });

      content.appendChild(closeButton);
      dialogBox.appendChild(content);
      document.body.prepend(dialogBox);
    },
    args: [tabTitle, tabID]
  });
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Message received in the background script:', message.action);
  //All the action Key words needs to stored in a cetrailized store/module
  if (message.action === 'snapshot') {
    percySnapshot(message.name);
  } else if (message.action === 'toggle_capture') {
    automated_capture = message.state;
  }
  // Process the message or send a response if needed
});
//storage key

// Session storage initialize
let storage_snapshot_key = 'percy_snapshots';
chrome.tabs.onActivated.addListener(onTabActivated);
// //add filter feature in future
chrome.webNavigation.onCompleted.addListener(onPageLoadComplete, {
  urls: ['<all_urls>']
});

// Handle tab switch event
function onTabActivated(activeInfo) {
  const tabId = activeInfo.tabId;
  checkPageLoadComplete(tabId);
}

// Handle the completion of page loading
function onPageLoadComplete(details) {
  const tabId = details.tabId;
  checkPageLoadComplete(tabId);
}

// Listen to button clicks and navigation events using the chrome.tabs API
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && changeInfo.url) {
    // Navigation to a different URL
    checkPageLoadComplete(tabId);
  }
});

// Check if the page has completely loaded
function checkPageLoadComplete(tabId) {
  // Check if the tab exists
  chrome.tabs.get(tabId, tab => {
    if (chrome.runtime.lastError || !tab) {
      // Tab doesn't exist or there was an error
      return;
    }

    // Check if all frames have finished loading
    if (tab.status === 'complete' && !tab.pendingUrl && automated_capture) {
      console.log('Page loaded completely:', tab.url);
      chrome.runtime.onMessage.addListener(message => {
        if (message.action === 'elementClicked') {
          console.log(message.element);
        }
      });
      injectDialogBox(tab);
      // percySnapshot();
      // Perform any actions you want after the page is completely loaded
      // ...
    }
  });
}

//tab switch
//button clicks
//navigation to a different url
// chrome.webNavigation.onCompleted.addListener(onPageLoadComplete, {
//   urls: ['<all_urls>'],
// });
// chrome.tabs.onActivated.addListener(onPageLoadComplete);
// chrome.webNavigation.onBeforeNavigate.addListener(onPageLoadComplete, {
//   urls: ['<all_urls>'],
// });

// // Handle the completion of page loading
// function onPageLoadComplete(details) {
//   console.log("sssss")
//   const tabId = details.tabId;

//   // Check if the tab exists
//   chrome.tabs.get(tabId, (tab) => {
//     if (chrome.runtime.lastError || !tab) {
//       // Tab doesn't exist or there was an error
//       return;
//     }

//     // Check if all frames have finished loading
//     if (tab.status === 'complete' && !tab.pendingUrl) {
//       console.log('Page loaded completely:', tab.url);
//       percySnapshot();
//       // Perform any actions you want after the page is completely loaded
//       // ...
//     }
//   });
// }

// //add filter feature in future
// // const filter = {
// //   url: [
// //     {
// //       urlMatches: 'https://www.google.com/',
// //     },
// //   ],
// // };
// chrome.webNavigation.onDOMContentLoaded.addListener(() => {
//   console.info('The user has loaded my favorite website!');
// });
// window.addEventListener('load', function () {
//   // Use Intersection Observer API to detect when new elements become visible
//   const observer = new IntersectionObserver(function (entries, observer) {
//     entries.forEach(function (entry) {
//       // Check if the element is visible
//       if (entry.isIntersecting) {
//         // Perform any necessary actions, such as capturing a snapshot with Percy
//         console.log('Element is visible:', entry.target);
//       }
//     });
//   });

//   // Observe the entire document for new elements
//   observer.observe(document.documentElement);
// });

// CANT be used manifest v3
// async function fetchPercyDom() {
//   const response = await fetch('http://localhost:5338/percy/dom.js');
//   if (!response.ok) {
//     throw new Error(
//       `Failed to fetch Percy DOM script: ${response.status} ${response.statusText}`
//     );
//   }
//   return await response.text();
// }

async function percySnapshot(snapshotName) {
  console.log('in percy snapshot background script');
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  await chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    files: ['dom.js']
  });
  const results = await chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    files: ['serialize.js']
  });
  const ss = await chrome.tabs.captureVisibleTab(null, {
    quality: 20
  });
  if (results.length == 0) {
    throw new Error(`Failed to serialize the DOM`);
  }

  // return results[0];
  console.log(results);
  const data = {
    domSnapshot: results[0].result,
    url: tab.url,
    name: snapshotName == null ? tab.title : snapshotName
    // clientInfo: JSON.stringify({ environment: 'development' }),
    // widths: [1280],
    // enableJavaScript: false,
  };
  // nSTORE SNAPSHOTS TO SHARED LOCAL STORAGE
  chrome.storage.local.get('snapshots', function (result) {
    var value = result.snapshots;
    console.log('Value retrieved from localStorage:', value);
    //if value is not undefined
    if (value != undefined) {
      value[data.name] = {
        percyData: data,
        screenshot: ss
      };
      console.log(value);
      chrome.storage.local.set({
        snapshots: value
      }, function () {
        console.log('Value is set in localStorage.');
      });
    } else {
      chrome.storage.local.set({
        snapshots: {
          [data.name]: {
            percyData: data,
            screenshot: ss
          }
        }
      }, function () {
        console.log('Value is set in localStorage.');
      });
    }
  });

  // fetch('http://localhost:5338/percy/snapshot', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((response) => {
  //     console.log(response);
  //     return true;
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     return false;
  //   });
}

// Add event listeners for various events

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		let errorOverlay;
		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
			errorOverlay = __react_refresh_error_overlay__;
		}
		let testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("fea561c1751aeb35589e")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=background.f07932926472612e16f0.hot-update.js.map