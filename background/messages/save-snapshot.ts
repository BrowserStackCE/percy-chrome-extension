import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Snapshot, SnapshotSchema } from "~schemas/snapshot"
import { Percy } from "~utils/percy-utils";



const handler: PlasmoMessaging.MessageHandler<Snapshot> = async (req, res) => {
    if (req.name !== 'save-snapshot') return;
    try {
        const url = req.sender.url
        const snapshot = SnapshotSchema.parse({
            ...req.body,
            url
        })
        await Percy.addSnapshot(snapshot)
        res.send({ success: true })
    } catch (err) {
        res.send({ success: false, error: err })
        console.error(err)
    }
}

export default handler