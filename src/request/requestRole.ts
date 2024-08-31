import { Role } from "../types/types"

export async function getListRole(): Promise<{roles: Array<Role>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(import.meta.env.VITE_URL_API+"/role", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const roles = data

    return {
        roles
    }
}