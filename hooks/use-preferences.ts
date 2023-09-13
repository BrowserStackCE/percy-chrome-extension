import { useEffect, useState } from "react";
import { Preferences } from "~schemas/preferences";
import { PreferencesCallback } from "~utils/preferences";

export function usePreferences() {
    const [preferences, SetPreferences] = useState<Preferences>(undefined)
    useEffect(() => {
        const unsub = PreferencesCallback((changes) => {
            SetPreferences(changes.preferences?.newValue)
        })
        return unsub
    }, [])
    return { preferences }
}