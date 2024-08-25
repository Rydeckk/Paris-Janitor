import { Logement } from "../types/types";

export async function createDateIndisponible(logementId: number, date: Date[]): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/date")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify({date: date})
    })

    const data = await response.json()
    return data
}

export async function delteDateIndisponible(logementId: number, id: number): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/date/"+id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
    return data
}