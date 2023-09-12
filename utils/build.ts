import { PercyBuild, PercyBuildSchema } from "~schemas/build"
import { postSnapshot } from "./percy-utils"

export function CreateBuild() {
    chrome.storage.local.set({
        percyBuild: { snapshots: [] }
    }).catch(console.error)
}

export function DeleteBuild() {
    chrome.storage.local.set({
        percyBuild: false,
        autoCapture: false
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
            if (changes.percyBuild !== undefined) {
                fn(changes)
            }
        }
    }
    chrome.storage.local.get('percyBuild').then(({ percyBuild }) => {
        fn({
            percyBuild: {
                newValue: percyBuild
            }
        })
    })
    chrome.storage.onChanged.addListener(callback);
    return () => {
        chrome.storage.onChanged.removeListener(callback)
    }
}

export async function FinaliseBuild(build: PercyBuild) {
    const errors = []
    const success = []
    for (const snapshot of build.snapshots) {
        const percySnapshot = {
            // required
            name: snapshot.options.name,
            url: snapshot.url,
            domSnapshot: snapshot.dom,
            // optional
            environmentInfo: [],
            clientInfo: "browser-extension/0.0.1",
            widths: snapshot.options.widths?.map((w) => Number(w)).filter((w) => w != NaN),
            minHeight: Number(snapshot.options["min-height"] || 0),
            enableJavaScript: snapshot.options["enable-javascript"],
            requestHeaders: snapshot.headers
        }
        try {
            const res = await postSnapshot(percySnapshot)
            success.push(res)
        } catch (err) {
            errors.push(err)
        }
    }
    return {errors,success};
}