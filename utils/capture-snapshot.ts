import { SnapshotOptions } from "~schemas/snapshot"
import { sendToBackground } from "@plasmohq/messaging"
import Serialize from '@percy/dom'
import { message } from "antd"
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
        }).then(()=>{
            message.success({
                content:"Snapshot Captured",
                className: "percy-extension-snapshot-message"
            })
        })
    } catch (err) {
        console.error(err)
    }
}