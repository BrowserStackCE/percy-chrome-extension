import { PercyBuild, PercyBuildSchema } from "~schemas/build"

export function CreateBuild() {
    chrome.storage.local.set({
        percyBuild: { snapshots: [] }
    }).catch(console.error)
}

export function DeleteBuild() {
    chrome.storage.local.set({
        percyBuild: false
    }).catch(console.error)
}

export function UpdateBuild(build: PercyBuild) {
    try {
        PercyBuildSchema.parse(build)
        chrome.storage.local.set({
            percyBuild: build
        })
    } catch (err) {
        console.error(err)
    }
}

export function PercyBuildCallback(fn: (changes) => void) {
    const callback = (changes, areaName) => {
        if (areaName == 'local') {
            if (changes.percyBuild) {
                fn(changes)
            }
        }
    }
    chrome.storage.local.get('percyBuild').then(({ percyBuild }) => {
        fn({
            autoCapture: {
                newValue: percyBuild
            }
        })
    })
    chrome.storage.onChanged.addListener(callback);
    return () => {
        chrome.storage.onChanged.removeListener(callback)
    }
}