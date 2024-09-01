import { Facture } from "../types/types";

export async function downloadFacture(facture: Facture): Promise<void> {
    const url = new URL(import.meta.env.VITE_URL_API+ "/facture/" + facture.id + "/download")
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
        a.download = facture.nomFacture; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } else {
        console.log(await response.statusText)
    }
    
}

export async function getListFacture(userId?: number): Promise <{factures: Array<Facture>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/facture")
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

export async function getListMyFacture(): Promise <{factures: Array<Facture>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/myFacture")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    return data
}