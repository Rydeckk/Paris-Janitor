import { Devis, DevisData } from "../types/types"

export async function createDevis(devisData: DevisData): Promise<Devis | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/devis")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify(devisData)
    })

    const data = await response.json()
    return data
}

export async function createDevisNonConnecte(devisData: DevisData): Promise<Devis | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/devisNonConnecte")
    const headers = new Headers({'Content-Type': 'application/json'})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify(devisData)
    })

    const data = await response.json()
    return data
}

export async function getListDevis(userId?: number): Promise <{devis: Array<Devis>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/devis")
    if(userId) {
        url.searchParams.append("userId", String(userId))
    }
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    return data
}

export async function getListMyDevis(): Promise <{devis: Array<Devis>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/myDevis")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    return data
}

export async function downloadDevis(devis: Devis): Promise<void> {
    const url = new URL(import.meta.env.VITE_URL_API+ "/devis/" + devis.id + "/download")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
    })

    if(await response.status !== 404) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = devis.nomDevis; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } else {
        console.log(await response.statusText)
    }
    
}