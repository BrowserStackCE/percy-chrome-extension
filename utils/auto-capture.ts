import { LocalStorage } from "./storage"

export class AutoCapture{
    static start(){
        return LocalStorage.set('autoCapture',true)
    }

    static stop(){
        return LocalStorage.set('autoCapture',false)
    }
    
    static listen(callback:(value:boolean)=>void){
        return LocalStorage.listen<boolean>('autoCapture',callback)
    }
}