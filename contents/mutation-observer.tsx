import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo } from "react"

import { useAutoCapture } from "~hooks/use-autocapture"
import { CaptureSnapshot } from "~utils/capture-snapshot";

export const config: PlasmoCSConfig = {
  run_at: "document_idle",
  matches: ["http://*/*", "https://*/*"],
}
let timeout: NodeJS.Timeout | undefined = undefined;
var count = 0;
export default function SnapshotModal() {
  const { autoCapture } = useAutoCapture()
  const observer = useMemo(() => new MutationObserver((mutationList, observer) => {
    mutationList = mutationList.filter((record) => !(record.target as Element)?.classList?.contains('percy-chrome-extension-item'))
    if (mutationList.length <= 0) {
      return;
    }
    console.log(mutationList)
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined;
    }
    timeout = setTimeout(() => {
      CaptureSnapshot({
        name: count ? `${document.title}_${count}` : document.title,
        widths: [375, 1280],
        "min-height": "1024"
      })
      count++;
    }, 1000)
  }), []);
  
  const observerOptions = {
    subtree: true, // Watch for changes in descendants as well
    attributes: true,
    attributeFilter: ["style", "class", "value"],
    characterData: true
  }

  useEffect(() => {
    if (autoCapture) {
      observer.observe(window.document, observerOptions)
    } else {
      try {
        observer.disconnect()
      } catch (err) {

      }
    }
    return ()=>{
      observer.disconnect()
    }
  }, [autoCapture])

  return
}
