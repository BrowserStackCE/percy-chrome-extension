import { useEffect, useState } from "react";
import { PercyBuild } from "~schemas/build";
import { CreateBuild, DeleteBuild } from "~utils/build";

export function usePercyBuild() {
    const [build, SetBuild] = useState<PercyBuild>(undefined)
    useEffect(() => {
        const OnStateChanged = (changes, area) => {
            if (area == 'local') {
                if (changes?.percyBuild) {
                    SetBuild(changes.percyBuild.newValue)
                }
            }
        }
        chrome.storage.local.get("percyBuild").then(({ percyBuild }) => {
            SetBuild(percyBuild)
        })
        chrome.storage.onChanged.addListener(OnStateChanged)
        return () => {
            chrome.storage.onChanged.removeListener(OnStateChanged)
        }
    }, [])
    return { build }
}