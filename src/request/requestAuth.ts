import { LoginInfo, SignUpInfo, UserInfoWithId } from "../types/types"

export async function login(loginInfo: LoginInfo) {
    const url = new URL(import.meta.env.VITE_URL_API+"/auth/login")
    const headers = new Headers({'Content-Type': 'application/json'})
    const response = await fetch(url , {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(loginInfo)
    })

    
    if(response.status === 200) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
    } else {
        return (await response.json()).error
    }
    
}

export async function signUp(signUpInfo: SignUpInfo) {
    const url = new URL(import.meta.env.VITE_URL_API+"/auth/signup")
    const headers = new Headers({'Content-Type': 'application/json'})
    const response = await fetch(url , {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(signUpInfo)
    })

    if(response.status === 200) {
        const data = await response.json()
    } else {
        return (await response.json()).error
    }
} 

export async function logout() {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(import.meta.env.VITE_URL_API+"/auth/logout", {
        
        method: 'DELETE',
        headers: headers
      })

      localStorage.removeItem('token')
  }