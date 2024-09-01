import { Operation } from "../types/types";

export async function getMyListOperation(): Promise<{operations: Operation[]}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/operation")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const operations = data

    return {
        operations
    }
}

export async function getListOperationPJ(): Promise<{operations: Operation[]}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/operationPJ")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const operations = data

    return {
        operations
    }
}