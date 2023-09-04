import type { PlasmoMessaging } from "@plasmohq/messaging"
import { PercyBuild } from "~schemas/build"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    if (req.name !== 'finalize-build') return;

    // Check if Percy Local Server is running
    // If percy is not running
    /**
     * chrome.tabs.create({
                url: "./tabs/start-percy.html"
            })
     */
    const Build = await chrome.storage.local.get('percyBuild').then((res)=>res.percyBuild as PercyBuild);

    // Loop through snaphshots and upload them.
}

export default handler