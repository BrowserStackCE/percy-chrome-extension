import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { PercyBuild } from "~schemas/build"
import { StopAutoCapture } from "~utils/auto-capture"
import { DeleteBuild, FinaliseBuild } from "~utils/build"
import { isPercyEnabled, stopPercy } from "~utils/percy-utils"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.name !== "finalize-build") return

  const Build = await chrome.storage.local
    .get("percyBuild")
    .then((res) => res.percyBuild as PercyBuild)
  const buildInfo = await isPercyEnabled()
  if (Build && buildInfo) {
    await StopAutoCapture()
    const {errors,success} = await FinaliseBuild(Build)
    const stopped = await stopPercy()
    await DeleteBuild()
    chrome.tabs.create({
        url:buildInfo.build.url
    })
    res.send(buildInfo)
  } else {
    console.log("Percy not enabled")
    // Docs Page
    chrome.tabs.create({
        url:'./tabs/installation.html'
    })
    res.send(null)
  }
}

export default handler