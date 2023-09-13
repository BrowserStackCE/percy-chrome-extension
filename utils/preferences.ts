import { Preferences } from "~schemas/preferences";

export function GetPreferences(){
    return chrome.storage.local.get('preferences')
}

export function SetPreferences(preferences:Preferences){
    return chrome.storage.local.set({
        preferences
    })
}

export function PreferencesCallback(fn: (changes) => void) {
    const callback = (changes, areaName) => {
        if (areaName == 'local') {
            if (changes.preferences) {
                fn(changes)
            }
        }
    }
    GetPreferences().then(({preferences})=>{
        console.log(preferences)
        fn({
            preferences: {
                newValue: preferences
            }
        })
    })
    chrome.storage.onChanged.addListener(callback);
    return () => {
        chrome.storage.onChanged.removeListener(callback)
    }
}