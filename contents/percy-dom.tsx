import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import { type SnapshotOptions, SnapshotOptionsSchema } from "~schemas/snapshot"
import { CaptureSnapshot } from "~utils/capture-snapshot"
import { useLocalStorage } from "~hooks/use-storage"
import { type PercyBuild } from "~schemas/build"


export const config: PlasmoCSConfig = {
    run_at: "document_start",
    matches: ["http://*/*", "https://*/*"],
}

export default function SnapshotModal() {
    const [build] = useLocalStorage<PercyBuild>('build')
    useMessage<{name?:string,options:SnapshotOptions}, any>(async (req, res) => {
        if (req.name === 'take_snapshot') {
            try {
                const options = SnapshotOptionsSchema.parse(req.body?.options || {})
                await CaptureSnapshot(options,req.body?.name)
                res.send({ success: true })
            } catch (err) {
                console.log(err)
                res.send({ success: false, error: err })
            }
        }
    })
    return null;
}