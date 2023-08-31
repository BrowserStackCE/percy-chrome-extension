const menuItemMap = {
  PAGE: "Start Percy",
  PAGE2: "Stop Percy",
  PAGE3: "Capture Single Snapshot",
  PAGE4: "Finalise Build",
  PAGE5: "View Snapshots"
}

let percyRunning = false

const startPercyHandler = (info, tab) => {
  console.log("Started Percy")
  percyRunning = true
  updateContextMenu()
}

const stopPercyHandler = (info, tab) => {
  console.log("Stopped Percy!")
  percyRunning = false
  updateContextMenu()
}

const updateContextMenu = () => {
  chrome.contextMenus.update(menuItemMap.PAGE2, {
    visible: percyRunning
  })
}

const singleSnapshotHandler = (info, tab) => {
  console.log("Capture Single Snapshot is clicked")
}

const finaliseBuildHandler = (info, tab) => {
  console.log("Finalise Build")
}

const viewSnapshotHandler = (info, tab) => {
  console.log("View Snapshots is clicked")
}

const clickHandlerMap = {
  [menuItemMap.PAGE]: startPercyHandler,
  [menuItemMap.PAGE2]: stopPercyHandler,
  [menuItemMap.PAGE3]: singleSnapshotHandler,
  [menuItemMap.PAGE4]: finaliseBuildHandler,
  [menuItemMap.PAGE5]: viewSnapshotHandler
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: menuItemMap.PAGE,
    title: "Start percy",
    contexts: ["page"]
  })

  chrome.contextMenus.create({
    id: menuItemMap.PAGE2,
    title: "Stop percy",
    contexts: ["page"]
  })

  chrome.contextMenus.create({
    id: menuItemMap.PAGE3,
    title: "Capture single snapshot",
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
