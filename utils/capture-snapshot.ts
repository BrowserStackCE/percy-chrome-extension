import { SnapshotOptions } from "~schemas/snapshot"
import { sendToBackground } from "@plasmohq/messaging"
import Serialize from '@percy/dom'
export async function CaptureSnapshot(options: SnapshotOptions) {
    console.info(`Serializing the DOM`)
    try {
        const dom = Serialize({ enableJavascript: options['enable-javascript'] || false })
        console.info(`DOM serialized successfully`)
        await sendToBackground({
            name: "save-snapshot",
            body: {
                dom,
                options
            }
        })
    } catch (err) {
        console.error(err)
    }
}