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