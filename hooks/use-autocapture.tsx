import { useEffect, useState } from "react";
import { AutoCaptureCallback } from "~utils/auto-capture";

export function useAutoCapture() {
    const [autoCapture, SetAutoCapture] = useState<boolean>(false)
    useEffect(() => {

        const unsub = AutoCaptureCallback((changes)=>{
            SetAutoCapture(changes.autoCapture.newValue)
        })

        return unsub;
    }, [])

    function ToggleAutoCapture(value?:boolean) {
        chrome.storage.local.set({
            autoCapture: value !== undefined? value: !autoCapture
        })
    }
    return { autoCapture, ToggleAutoCapture }
}