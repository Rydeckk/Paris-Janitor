import { Bannissement } from "../types/types"

export async function getListBannissement(): Promise<{bannissements: Array<Bannissement>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/bannissement")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const bannissements = data

    return {
        bannissements
    }
}