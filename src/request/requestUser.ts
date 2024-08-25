import { UserInfoWithId } from "../types/types"

export async function getUser(): Promise<UserInfoWithId | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/auth/info")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
    })

    if(await response.status === 200) {
        return await response.json()
    } else {
        return null
    }
}

export async function getListUser(): Promise<{users: Array<UserInfoWithId>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(import.meta.env.VITE_URL_API+"/user", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const users = data

    return users || []
}

export async function updateUser(user: UserInfoWithId) {
    const url = new URL(import.meta.env.VITE_URL_API+"/user/"+user.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url , {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({roleId: user.role.id})
    })

    const data = await response.json()
    
    return data
}