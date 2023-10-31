import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { PercyBuild } from "~schemas/build"
import { AutoCapture } from "~utils/auto-capture"
import { Percy } from "~utils/percy-utils"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.name !== "finalize-build") return
  try{
    res.send(await Percy.finalise().catch(console.error))
  }catch(err){
    res.send(false)
  }
}

export default handler