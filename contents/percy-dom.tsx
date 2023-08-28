import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import Serialize from '@percy/dom'
export const config: PlasmoCSConfig = {}
export default function SnapshotModal() {
    useMessage<string, string>(async (req, res) => {
        if (req.name === 'take_snapshot') {
            const body = req.body as any
            const dom = Serialize({enableJavascript:body.enableJavascript || false})
            res.send(dom)
        }
    })
    return null;
}