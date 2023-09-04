import { sendToContentScript } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useState } from "react"

import { useAutoCapture } from "~hooks/use-autocapture"
import { CaptureSnapshot } from "~utils/capture-snapshot";

export const config: PlasmoCSConfig = {}
let timeout : NodeJS.Timeout | undefined = undefined;
var count = 0;
export default function SnapshotModal() {
  const { autoCapture } = useAutoCapture()
  const observer = useMemo(() => new MutationObserver((mutationList, callback) => {
    if(timeout){
      clearTimeout(timeout)
    }
    timeout = setTimeout(()=>{
      CaptureSnapshot({
        name:count?`${document.title}_${count}`:document.title,
        widths:[375,1280],
        "min-height":"1024"
      })
      count++;
    },500)
  }), []);
  const targetNode = document.body // You can change this to the desired element
  const observerOptions = {
    subtree: true, // Watch for changes in descendants as well
    attributes: true,
    attributeFilter: ["style", "class"],
    characterData: true
  }

  useEffect(() => {
    console.log(autoCapture);
    if (autoCapture) {
      observer.observe(targetNode, observerOptions)
    } else {
      observer.disconnect()
    }
  }, [autoCapture])

  return
}
