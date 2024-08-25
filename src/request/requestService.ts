import { Service, TypeService } from "../types/types"

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