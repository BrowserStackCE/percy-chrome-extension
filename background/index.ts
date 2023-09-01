const menuItemMap = {
  PAGE: "Capture Single Snapshot",
  PAGE2: "Start Auto-Capture",
  PAGE3: "Stop Auto-Capture",
  PAGE4: "Finalise Build",
  PAGE5: "View Snapshots"
}

const singleSnapshotHandler = (info, tab) => {
  console.log("Capture Single Snapshot is clicked")
}

let autoCaptureRunning = false

const startAutoCaptureHandler = (info, tab) => {
  if (!autoCaptureRunning) {
    console.log("Started Auto Capture...")
    autoCaptureRunning = true
    updateContextMenu()
  }
}

const stopAutoCaptureHandler = (info, tab) => {
  if (autoCaptureRunning) {
    console.log("Stopped Auto Capture!")
    autoCaptureRunning = false
    updateContextMenu()
  }
}

const updateContextMenu = () => {
  chrome.contextMenus.update(menuItemMap.PAGE2, {
    visible: !autoCaptureRunning
  })

  chrome.contextMenus.update(menuItemMap.PAGE3, {
    visible: autoCaptureRunning
  })
}

const finaliseBuildHandler = (info, tab) => {
  console.log("Finalise Build")
}

const viewSnapshotHandler = (info, tab) => {
  console.log("View Snapshots is clicked")
}

const clickHandlerMap = {
  [menuItemMap.PAGE]: singleSnapshotHandler,
  [menuItemMap.PAGE2]: startAutoCaptureHandler,
  [menuItemMap.PAGE3]: stopAutoCaptureHandler,
  [menuItemMap.PAGE4]: finaliseBuildHandler,
  [menuItemMap.PAGE5]: viewSnapshotHandler
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: menuItemMap.PAGE,
    title: "Capture Single Snapshot",
    contexts: ["page"]
  })

  chrome.contextMenus.create({
    id: menuItemMap.PAGE2,
    title: "Start Auto-Capture",
    contexts: ["page"]
  })

  chrome.contextMenus.create({
    id: menuItemMap.PAGE3,
    title: "Stop Auto-Capture",
    contexts: ["page"]
  })

  chrome.contextMenus.create({
    id: menuItemMap.PAGE4,
    title: "Finalise build",
    contexts: ["page"]
  })

  chrome.contextMenus.create({
    id: menuItemMap.PAGE5,
    title: "View snapshots",
    contexts: ["page"]
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const { menuItemId } = info

    const handler = clickHandlerMap[menuItemId]

    if (handler) {
      handler(info, tab)
    }
  })

  updateContextMenu()
})
