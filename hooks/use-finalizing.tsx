import { useEffect, useState } from "react";
import { sendToBackground } from "@plasmohq/messaging";


export function useFinalizing() {
    const [finalizing,SetFinalising]=useState<boolean>(false)

    function triggerFinalize(){
        SetFinalising(true)
        sendToBackground({name:'finalize-build'}).finally(()=>{
                SetFinalising(false)
            })
    }
    
    return {finalizing,triggerFinalize};
}