import { useEffect, useState } from "react";

export function useLocalStorage<T=any>(key:string,init?:T){
    const [value,SetState] = useState(init)

    useEffect(()=>{
        chrome.storage.local.get(key,(record)=>{
            SetState(record[key])
        })

        chrome.storage.local.onChanged.addListener((changes)=>{
            if(changes[key]){
                SetState(changes[key].newValue)
            }
        })
    },[])

    const SetValue = (val:T)=>{
        return chrome.storage.local.set({
            [key]:val
        })
    }

    return [value,SetValue] as [T,(val:T)=>Promise<void>]
}

export function useSessionStorage<T=any>(key:string,init?:T){
    const [value,SetState] = useState(init)

    useEffect(()=>{
        chrome.storage.session.get(key,(record)=>{
            SetState(record[key])
        })

        chrome.storage.session.onChanged.addListener((changes)=>{
            if(changes[key]){
                SetState(changes[key].newValue)
            }
        })
    },[])

    const SetValue = (val:T)=>{
        return chrome.storage.local.set({
            [key]:val
        })
    }

    return [value,SetValue] as [T,(val:T)=>Promise<void>]
}