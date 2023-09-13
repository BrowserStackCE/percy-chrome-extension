import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import { SnapshotOptions, SnapshotOptionsSchema } from "~schemas/snapshot"
import { CaptureSnapshot } from "~utils/capture-snapshot"


export const config: PlasmoCSConfig = {
    run_at: "document_start",
    matches: ["http://*/*", "https://*/*"],
}

export default function SnapshotModal() {
    useMessage<SnapshotOptions, any>(async (req, res) => {
        console.debug(`Received Request ${JSON.stringify(req, undefined, 2)}`)
        if (req.name === 'take_snapshot') {
            try {
                const options = SnapshotOptionsSchema.parse(req.body)
                await CaptureSnapshot(options)
                res.send({ success: true })
            } catch (err) {
                res.send({ success: false, error: err })
            }
        } else if (req.name === 'take_snapshot_with_modal') {
            const snapshotName = prompt("Enter Snapshot Name");
            if (snapshotName) {
                try {
                    await CaptureSnapshot({
                        name: snapshotName,
                        widths: [375, 1280],
                        "min-height": "1024"
                    })
                    res.send({ success: true })
                } catch (err) {
                    res.send({ success: false, error: err })
                }
            }
        }

    })
    return null;
}