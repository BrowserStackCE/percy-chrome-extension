import { useEffect, useState } from "react";
import { PercyBuild } from "~schemas/build";
import {  PercyBuildCallback } from "~utils/build";

export function usePercyBuild() {
    const [build, SetBuild] = useState<PercyBuild>(undefined)
    useEffect(() => {
        const unsub = PercyBuildCallback((changes) => {
            if (changes?.percyBuild) {
                SetBuild(changes.percyBuild.newValue)
            }
        })
        return unsub
    }, [])
    return { build }
}