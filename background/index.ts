import { sendToContentScript } from "@plasmohq/messaging";
import { PreferncesSchema } from "~schemas/preferences";
import { AutoCapture } from "~utils/auto-capture";
import { Commands } from "~utils/commands";
import { Percy } from "~utils/percy-utils";
import { LocalStorage } from "~utils/storage";

let autoCaptureRunning = false
let percyEnabled = false

const contextMenus = {
    'Capture Single Snapshot': {
        handler: () => {
            sendToContentScript({ name: 'take_snapshot' })
        },
        visible: () => percyEnabled,
        shortcut: "Alt + Q"
    },
    'Start Auto-Capture': {
        handler: () => {
            AutoCapture.start()
        },
        visible: () => percyEnabled && !autoCaptureRunning,
        shortcut: "Alt + W"
    },
    'Stop Auto-Capture': {
        handler: () => {
            AutoCapture.stop()
        },
        visible: () => percyEnabled && autoCaptureRunning,
        shortcut: "Alt + W"
    },
    'View snapshots': {
        handler: () => {
            chrome.tabs.create({
                url: "./tabs/snapshots.html"
            })
        },
        visible: () => percyEnabled,
        shortcut: "Alt + E"
    },
    'Options': {
        handler: () => {
            chrome.tabs.create({
                url: "./options.html"
            })
        },
        visible: () => true,
        shortcut: "Alt + R"
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
        chrome.contextMenus.update(key, {
            visible: contextMenus[key].visible()
        })
    })
}

AutoCapture.listen((val)=>{
    autoCaptureRunning = val
    UpdateContextMenusVisibility(["Start Auto-Capture", "Stop Auto-Capture"])
})

Percy.listen((build)=>{
    percyEnabled = build != false && build != undefined
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

    (async ()=>{
        let preferences = await LocalStorage.get('preferences')
        if(!preferences){
            preferences = PreferncesSchema.parse({})
            await LocalStorage.set('preferences',preferences)
        }
    })()

})

chrome.commands.onCommand.addListener((command)=>{
    switch(command){
        case Commands.autoCapture:
            if(autoCaptureRunning){
                contextMenus["Stop Auto-Capture"].handler()
            }else{
                contextMenus["Start Auto-Capture"].handler()
            }
            break;
        case Commands.takeSnapshot:
            contextMenus["Capture Single Snapshot"].handler()
            break;
        case Commands.viewOptions:
            contextMenus["Options"].handler()
            break;
        case Commands.viewSnapshots:
            contextMenus["View snapshots"].handler()
            break;
    }
})