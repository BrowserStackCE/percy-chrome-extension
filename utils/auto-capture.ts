export function StartAutoCapture() {
    return chrome.storage.local.set({
        autoCapture: true
    })
}

export function StopAutoCapture() {
    return chrome.storage.local.set({
        
    })
}

export function AutoCaptureCallback(fn: (changes) => void) {
    const callback = (changes, areaName) => {
        if (areaName == 'local') {
            if (changes.autoCapture) {
                fn(changes)
            }
        }
    }
    chrome.storage.local.get('autoCapture').then(({ autoCapture }) => {
        fn({
            autoCapture: {
                newValue: autoCapture
            }
        })
    })
    chrome.storage.onChanged.addListener(callback);
    return () => {
        chrome.storage.onChanged.removeListener(callback)
    }
}