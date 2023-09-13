import { SnapshotOptions } from "~schemas/snapshot"
import { sendToBackground } from "@plasmohq/messaging"
import Serialize from '@percy/dom'
import { message } from "antd"
export async function CaptureSnapshot(options: SnapshotOptions) {
    console.info(`Serializing the DOM`)
    const dom = Serialize({ 
        enableJavascript: options['enable-javascript'] || false,
        domTransformation: (documentElement)=>{
            documentElement.querySelectorAll('.percy-chrome-extension-item').forEach(e => e.remove());
        }
    })
    console.info(`DOM serialized successfully`)
    await sendToBackground({
        name: "save-snapshot",
        body: {
            dom,
            options
        }
    }).then(() => {
        message.success({
            content: "Snapshot Captured",
            className: "percy-chrome-extension-item"
        })
    }).catch((err)=>{
        message.error({
            content:`Snapshot Captured failed. Error: ${err}`,
            className: "percy-chrome-extension-item"
        })
    })

}
