import { CreateEtatLieu, EtatLieu } from "../types/types";

export async function getListEtatLieuLogement(logementId: number): Promise<{etatLieux: EtatLieu[]}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/etatLieu")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const etatLieux = data

    return {
        etatLieux
    }
}

export async function getListEtatLieu(): Promise<{etatLieux: EtatLieu[]}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/etatLieu")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const etatLieux = data

    return {
        etatLieux
    }
}

export async function createEtatLieu(createEtatLieu: CreateEtatLieu): Promise<EtatLieu | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/reservation/"+createEtatLieu.reservationId+"/etatLieu")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify({type: createEtatLieu.type, etatsEquipements: createEtatLieu.etatsEquipements})
    })

    const data = await response.json()
    return data
}

export async function downloadEtatLieu(etatLieu: EtatLieu) {
    const url = new URL(import.meta.env.VITE_URL_API+"/etatLieu/"+etatLieu.id+"/download")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    if(await response.status !== 404) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = etatLieu.nomEtatLieu; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } else {
        console.log(await response.statusText)
    }
}