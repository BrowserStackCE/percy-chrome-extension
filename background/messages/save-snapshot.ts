import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Snapshot, SnapshotSchema } from "~schemas/snapshot"



const handler: PlasmoMessaging.MessageHandler<Snapshot> = async (req, res) => {
    if(req.name !== 'save-snapshot') return;
    console.debug(`Received Request ${JSON.stringify(req, undefined, 2)}`)
    try {
        const url = req.sender.url
        // const headers = (await chrome.storage.session.get(url))[url] || {}
        // console.log(headers)
        // const cookie = await new Promise<string>((resolve)=>{
        //     chrome.cookies.getAll({url:url},(cookies)=>{
        //         resolve(cookies.map((c)=>`${c.name}=${c.value}`).join(';'))
        //     })
        // })
        // headers['cookie'] = cookie
        // console.info("Setting Cookie " + cookie)
        console.info("Validation req body")
        const snapshot = SnapshotSchema.parse({
            ...req.body,
            url
        })
        console.info(`Snapshot created ${JSON.stringify(snapshot, undefined, 2)}`)
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
        })

        res.send({success:true})
    } catch (err) {
        res.send({success:false, error:err})
    }
}

export default handler