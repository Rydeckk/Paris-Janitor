import { Service, ServiceCreate, TypeService } from "../types/types"

export async function getListService(type?: TypeService): Promise<{services: Array<Service>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/service?")
    if(type) {
        url.searchParams.append("type", type)
    }
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const services = data

    return services || []
}

export async function getListServiceOwner(): Promise<{services: Array<Service>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/serviceOwner?")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const services = data

    return services || []
}

export async function createService(serviceCreated: ServiceCreate): Promise<Service | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/service")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify(serviceCreated)
    })

    const data = await response.json()
    return data
}

export async function updateService(serviceUpdated: Service): Promise<Service | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/service/"+serviceUpdated.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(serviceUpdated)
    })

    const data = await response.json()
    return data
}

export async function deleteService(id: number): Promise<Service | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/service/"+id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
    return data
}