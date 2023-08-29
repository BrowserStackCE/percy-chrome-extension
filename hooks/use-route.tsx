import { useEffect, useState } from "react";

export function useRoute() {
    const [route, SetRoute] = useState<string | undefined>('/')

    useEffect(() => {

        const RouteChangeCallback = (changes, area) => {
            if (area == 'session') {
                if (changes?.route) {
                    SetRoute(changes.route?.newValue)
                }
            }
        }

        chrome.storage.session.get({ route: '/' }).then(({ route }) => {
            SetRoute(route)
        })

        chrome.storage.onChanged.addListener(RouteChangeCallback)
        return () => {
            chrome.storage.onChanged.removeListener(RouteChangeCallback)
        }
    }, [])

    function Navigate(path:string){
        chrome.storage.session.set({
            route:path
        })
    }
    return {route,Navigate}
}