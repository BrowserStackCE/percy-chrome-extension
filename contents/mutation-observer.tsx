import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useState } from "react"

import { useAutoCapture } from "~hooks/use-autocapture"

export const config: PlasmoCSConfig = {}

const mutationCallback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.")
    } else if (mutation.type === "attributes") {
      console.log(`The ${mutation.attributeName} attribute was modified.`)
    }
  }
}

export default function SnapshotModal() {
  const { autoCapture } = useAutoCapture()
  const observer = useMemo(()=> new MutationObserver(mutationCallback),[]);
  const targetNode = document.body // You can change this to the desired element
  const observerOptions = {
    childList: true, // Watch for changes in child elements
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
