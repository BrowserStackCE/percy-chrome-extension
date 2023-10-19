import { SnapshotOptions } from "~schemas/snapshot"
import { sendToBackground } from "@plasmohq/messaging"
import Serialize from '@percy/dom'
import { message } from "antd"
import { Checksum, getXPath } from "./xpath"
import { Percy } from "./percy-utils"
export async function CaptureSnapshot(options: SnapshotOptions, name?: string, event?: Event) {
    const build = await Percy.getBuild()
    if(!build) return;
    try {
        if (!name) {
            const nameComponents: string[] = []
            nameComponents.push(`[${document.title}]`)
            nameComponents.push(`${window.location.pathname}`)
            if (event) {
                nameComponents.push(`-(${event.type})`)
                if(event.type == 'input'){
                    //@ts-ignore
                    nameComponents.push(`-(value:${event.target?.value})`)
                }
                let xpath = getXPath(event.target, { ignoreId: false })
                if (xpath.length > 32) {
                    xpath = Checksum(xpath)
                }
                nameComponents.push(`-${xpath}`)
            }
            name = nameComponents.join('')
        }
        const dom = Serialize({
            enableJavascript: options['enable-javascript'] || false,
            domTransformation: (documentElement) => {
                documentElement.querySelectorAll('.percy-chrome-extension-item').forEach(e => e.remove());
            }
        })
        await sendToBackground({
            name: "save-snapshot",
            body: {
                dom,
                options:{
                    ...options,
                    name
                }
            }
        }).then((res) => {
            if (res.success) {
                message.success({
                    content: "Snapshot Captured",
                    className: "percy-chrome-extension-item"
                })
            } else {
                message.error({
                    content: `Snapshot Captured failed. Error: ${JSON.stringify(res.error)}`,
                    className: "percy-chrome-extension-item"
                })
            }
        }).catch((err) => {
            message.error({
                content: `Snapshot Captured failed. Error: ${err}`,
                className: "percy-chrome-extension-item"
            })
        })
    } catch (err) {
        message.error({
            content: `Snapshot Captured failed.`,
            className: "percy-chrome-extension-item"
        })
        console.error(err)
    }

}
