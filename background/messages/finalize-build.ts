import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(req)
}
 
export default handler