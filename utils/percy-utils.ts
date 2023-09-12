const baseurl = 'http://localhost:5338'
export function isPercyEnabled() {
    return fetch(`${baseurl}/percy/healthcheck`).then((res) => {
        if(res.status == 200){
            return res.json()
        }else{
            return false
        }
    }).catch(() => false)
}

export function postSnapshot(options: any, params?: any) {
    let query = params ? `?${new URLSearchParams(params)}` : '';
    return fetch(`${baseurl}/percy/snapshot${query}`, {
        body: JSON.stringify(options),
        method: 'POST'
    }).then(async (res) => {
        if (res.status == 200) {
            return res.json()
        } else {
            throw await res.text()
        }
    })
}

export function stopPercy(){
    return fetch(`${baseurl}/percy/stop`).then((res)=>res.status == 200).catch(()=>false)
}