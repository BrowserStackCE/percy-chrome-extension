import { isPercyEnabled, postSnapshot } from "@percy/sdk-utils"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { PercyBuild } from "~schemas/build"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.name !== "finalize-build") return

  // Check if Percy Local Server is running
  // If percy is not running
  /**
     * chrome.tabs.create({
                url: "./tabs/start-percy.html"
            })
     */

  const Build = await chrome.storage.local
    .get("percyBuild")
    .then((res) => res.percyBuild as PercyBuild)

  const percyEnabled = await isPercyEnabled()
  console.log("percyEnabled" + percyEnabled)

  if (Build && percyEnabled) {
    const snapshots = Build.snapshots
    for (const snapshot of snapshots) {
      const percySnapshot = {
        // required
        name: snapshot.options.name,
        url: "",
        domSnapshot: snapshot.dom,
        // optional
        environmentInfo: [],
        clientInfo: "",
        widths: snapshot.options.widths,
        minHeight: snapshot.options["min-height"],
        enableJavaScript: snapshot.options["enable-javascript"],
        requestHeaders: {}
      }
      //   await postSnapshot(percySnapshot)
      console.log("Snapshot post complete", percySnapshot)
    }
  } else {
    console.log("Percy not enabled")
  }
}

export default handler
