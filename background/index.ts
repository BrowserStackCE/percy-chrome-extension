import { sendToContentScript } from "@plasmohq/messaging";
import { PreferncesSchema } from "~schemas/preferences";
import { AutoCaptureCallback, StartAutoCapture, StopAutoCapture } from "~utils/auto-capture";
import { PercyBuildCallback } from "~utils/build";
import { GetPreferences, SetPreferences } from "~utils/preferences";

let autoCaptureRunning = false
let percyEnabled = false

const contextMenus = {
    'Capture Single Snapshot': {
        handler: () => {
            sendToContentScript({ name: 'take_snapshot_with_modal' })
        },
        visible: () => percyEnabled
    },
    'Start Auto-Capture': {
        handler: () => {
            StartAutoCapture()
        },
        visible: () => percyEnabled && !autoCaptureRunning
    },
    'Stop Auto-Capture': {
        handler: () => {
            StopAutoCapture()
        },
        visible: () => percyEnabled && autoCaptureRunning
    },
    'View snapshots': {
        handler: () => {
            chrome.tabs.create({
                url: "./tabs/snapshots.html"
            })
        },
        visible: () => percyEnabled
    },
    'Options': {
        handler: () => {
            chrome.tabs.create({
                url: "./options.html"
            })
        },
        visible: () => true
    }
}

function CreateContextMenus() {
    Object.entries(contextMenus).forEach(([key, value]) => {
        chrome.contextMenus.create({
            id: key,
            title: key,
            visible: value.visible(),
            contexts: ["page"] as any[]
        })
    })
}

function UpdateContextMenusVisibility(ids?: (keyof typeof contextMenus)[]) {
    (ids || Object.keys(contextMenus)).map((key) => {
        console.log(contextMenus[key].visible)
        chrome.contextMenus.update(key, {
            visible: contextMenus[key].visible()
        })
    })
}

AutoCaptureCallback((changes) => {
    autoCaptureRunning = changes.autoCapture.newValue
    UpdateContextMenusVisibility(["Start Auto-Capture", "Stop Auto-Capture"])
})

PercyBuildCallback((changes) => {
    percyEnabled = changes.percyBuild.newValue != false && changes.percyBuild.newValue != undefined
    console.log("PERCY ENABLED:" + percyEnabled)
    UpdateContextMenusVisibility()
})

CreateContextMenus();

chrome.contextMenus.onClicked.addListener((info, tab) => {
    const { menuItemId } = info
    contextMenus[menuItemId]?.handler?.()
})


// chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
//     chrome.storage.session.set({
//         [details.url]:details.requestHeaders.reduce((val,header)=>{
//             val[header.name] = header.value
//             return val;
//         },{})
//     })
// }, {
//     types: ['main_frame'],
//     urls: ['<all_urls>'],
// },['requestHeaders'])

chrome.runtime.onInstalled.addListener(() => {

    //# Initialize Preferences
    GetPreferences().then(({ preferences }) => {
        if (!preferences) {
            preferences = PreferncesSchema.parse({})
            SetPreferences(preferences)
        }
    })

    console.log("Installed")

})