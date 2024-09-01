import { CreateBannissement, UserInfoWithId } from "../types/types"

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

    return {
        users
    }
}

export async function getListUserBanni(): Promise<{users: Array<UserInfoWithId>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/user")
    url.searchParams.append("isBan","true")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const users = data

    return {
        users
    }
}

export async function getListUserNonBanni(): Promise<{users: Array<UserInfoWithId>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/user")
    url.searchParams.append("isBan","false")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const users = data

    return {
        users
    }
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

export async function createBannissement(user: UserInfoWithId, banni: CreateBannissement): Promise<UserInfoWithId | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/user/"+user.id+"/bannissement")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url , {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(banni)
    })

    const data = await response.json()
    
    return data
}

export async function updateBannissement(user: UserInfoWithId, bannissementId: number, dateFin: Date): Promise<UserInfoWithId | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/user/"+user.id+"/bannissement/"+bannissementId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url , {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({dateFin: dateFin})
    })

    const data = await response.json()
    
    return data
}