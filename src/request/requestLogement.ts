import { CreateLogement, Logement, LogementUpdate, StatutLogement } from "../types/types"

export async function getListLogementValide(): Promise<{logements: Array<Logement>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(import.meta.env.VITE_URL_API+"/logementValide", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const logements = data

    return logements || []
}

export async function getListMyLogement(): Promise<{logements: Array<Logement>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(import.meta.env.VITE_URL_API+"/MyLogement", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const logements = data

    return logements || []
}

export async function getListLogement(statut?: StatutLogement): Promise<{logements: Array<Logement>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement?")
    if(statut) {
        url.searchParams.append("statut", statut)
    }
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const logements = data

    return logements || []
}

export async function createLogement(createLogement: CreateLogement): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify(createLogement)
    })

    const data = await response.json()
    return data
}

export async function updateLogement(id:number, logement: LogementUpdate): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(logement)
    })

    const data = await response.json()
    return data
}

export async function deleteLogement(id: number): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
    return data
}

export async function addServiceLogement(logementId: number, serviceId: number): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/service/"+serviceId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers
    })

    const data = await response.json()
    return data
} 

export async function removeServiceLogement(logementId: number, serviceId: number): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/service/"+serviceId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
    return data
} 

export async function getLogement(logementId: number): Promise <Logement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    return data
}