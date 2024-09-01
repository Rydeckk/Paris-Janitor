export async function payeStatut(sessionId: string) {
    const url = new URL(import.meta.env.VITE_URL_API+"/payeStatut")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify({sessionId})
    })

    const data = await response.json()
    return data
} 