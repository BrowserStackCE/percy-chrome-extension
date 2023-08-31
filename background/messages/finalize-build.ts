import type { PlasmoMessaging } from "@plasmohq/messaging"
import { PercyBuild } from "~schemas/build"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    if (req.name !== 'finalize-build') return;
    const Build = await chrome.storage.local.get('percyBuild').then((res)=>res.percyBuild as PercyBuild)
}

export default handler