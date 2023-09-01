import { useEffect, useState } from "react";

export function useAutoCapture() {
    const [autoCapture, SetAutoCapture] = useState<boolean>(false)
    useEffect(() => {
        const OnAutoCaptureChange = (changes, area) => {
            console.log(changes)
            if (area == 'local') {
                if (changes?.autoCapture) {
                    SetAutoCapture(changes.autoCapture.newValue)
                }
            }
        }
        chrome.storage.local.get({ autoCapture: false }).then(({ autoCapture }) => {
            SetAutoCapture(autoCapture)
        })
        chrome.storage.onChanged.addListener(OnAutoCaptureChange)
        return () => {
            chrome.storage.onChanged.removeListener(OnAutoCaptureChange)
        }
    }, [])

    function ToggleAutoCapture(value?:boolean) {
        chrome.storage.local.set({
            autoCapture: value !== undefined? value: !autoCapture
        })
    }
    return { autoCapture, ToggleAutoCapture }
}