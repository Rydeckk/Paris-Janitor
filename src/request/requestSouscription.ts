import { Souscription } from "../types/types"

export async function getListSouscription(userId?: number): Promise<{souscriptions: Array<Souscription>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/souscription?")
    if(userId) {
        url.searchParams.append("userId",String(userId))
    }
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const souscriptions = data

    return souscriptions || []
}

export async function getListMySouscription(): Promise<{souscriptions: Array<Souscription>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/myListSouscription?")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const souscriptions = data

    return souscriptions || []
}

export async function getMyActualSouscription(): Promise<Souscription | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/myActualSouscription")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    if(response.ok) {
        const data = await response.json()
        return data
    } else {
        return null
    }
    
}