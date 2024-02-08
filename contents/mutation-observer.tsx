import { message, Tooltip } from "antd";
import EventEmitter from "events";
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useMemo, useState } from "react"

import { useLocalStorage } from "~hooks/use-storage";
import { type Preferences } from "~schemas/preferences";
import { CaptureSnapshot } from "~utils/capture-snapshot";

export const config: PlasmoCSConfig = {
  run_at: "document_start",
  matches: ["http://*/*", "https://*/*"],
}
let timeout: NodeJS.Timeout | undefined = undefined;
var count = 0;
export default function SnapshotModal() {
  const [autoCapture] = useLocalStorage('autoCapture', false)
  const [event, SetEvent] = useState<Event>()
  const [ready, SetReady] = useState(false)
  const [preferences] = useLocalStorage<Preferences>('preferences')
  const eventEmitter = useMemo(() => new EventEmitter(), [])
  const eventsToCapture: (keyof DocumentEventMap)[] = [
    'click',
    'drop',
    'dblclick',
    'input',
    'load'
  ]
  const observer = useMemo(() => new MutationObserver((mutationList, observer) => {
    mutationList = mutationList.filter((record) => !(record.target as Element)?.classList?.contains('percy-chrome-extension-item'))
    if (mutationList.length <= 0) {
      return;
    }
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined;
    }
    timeout = setTimeout(() => {
      eventEmitter.emit('capture')
      observer.disconnect()
      count++;
    }, 300)
  }), [event]);

  const observerOptions = {
    subtree: true, // Watch for changes in descendants as well
    attributes: true,
    attributeFilter: ["style", "class", "value"],
  }
  useEffect(() => {
    if (ready) {
      message.info({ content: `AutoCapture is ${autoCapture ? "Enabled" : "Disabled"}`, className: "percy-chrome-extension-item" })
    }
  }, [autoCapture])
  useEffect(() => {
    const onCapture = () => {
      if (event) {
        CaptureSnapshot(preferences.defaultSnapshotOptions, undefined, event)
        SetEvent(undefined)
      }
    }
    eventEmitter.on('capture', onCapture)
    return () => {
      eventEmitter.off('capture', onCapture)
    }
  }, [event])

  useEffect(() => {
    const onChange = (e: Event) => {
      SetEvent(e)
      if (e.type == 'load') {
        SetReady(true)
      }
      if (autoCapture) {
        if (e.type == 'load') {
          CaptureSnapshot(preferences.defaultSnapshotOptions, undefined, event)
        } else {
          observer.observe(window.document, observerOptions)
        }
      }
    }

    eventsToCapture.forEach((event) => {
      window.addEventListener(event, onChange, true)
    })

    return () => {
      observer.disconnect()
      eventsToCapture.forEach((event) => {
        document.removeEventListener(event, onChange, true)
      })
    }
  }, [autoCapture])
  return
}