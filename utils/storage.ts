export class LocalStorage{
    static get<T>(key:string,init?:any):Promise<T>{
        return chrome.storage.local.get(key).then((res)=>{
            return res[key] || init
        })
    }

    static set<T>(key:string,value:T){
        return chrome.storage.local.set({[key]:value})
    }

    static listen<T>(key:string,callback:(newValue:T)=>void){
        const fn = (changes:any)=>{
            if(changes[key]){
                callback(changes[key].newValue)
            }
        }
        chrome.storage.local.onChanged.addListener(fn)
        LocalStorage.get(key).then(callback)
        return ()=>chrome.storage.local.onChanged.removeListener(fn)
    }
}

export class SessionStorage{
    static get<T>(key:string,init?:any){
        return chrome.storage.local.get(key).then((res)=>{
            return res[key] || init
        })
    }

    static set<T>(key:string,value:T){
        return chrome.storage.local.set({[key]:value})
    }
}