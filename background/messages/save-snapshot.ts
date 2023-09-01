import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Snapshot, SnapshotSchema } from "~schemas/snapshot"



const handler: PlasmoMessaging.MessageHandler<Snapshot> = async (req, res) => {
    if(req.name !== 'save-snapshot') return;
    console.debug(`Received Request ${JSON.stringify(req, undefined, 2)}`)
    try {
        console.info("Validation req body")
        const snapshot = SnapshotSchema.parse(req.body)
        console.info("Req body validation successful")
        console.info("Capturing Preview")
        const screenshot = await chrome.tabs.captureVisibleTab(null, { quality: 5 });
        snapshot.screenshot = screenshot
        console.info("Preview captured successfully")
        console.info("Reading build from local storage")
        await chrome.storage.local.get('percyBuild').then(async ({percyBuild}) => {
            if (percyBuild.snapshots) {
                console.info("Appending to existing list of snapshots")
                percyBuild.snapshots.push(snapshot)
            } else {
                console.info("Creating list of snapshots")
                percyBuild.snapshots = [snapshot]
            }
            console.info("Saving build to local storage")
            await chrome.storage.local.set({ percyBuild }).then(()=>{
                console.info("Build saved to local storage")
            })
        }).finally(()=>{
            res.send(null)
        })
    } catch (err) {
        console.error(err)
    }
}

export default handler