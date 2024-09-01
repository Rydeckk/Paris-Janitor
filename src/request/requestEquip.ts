import { CreateEquipement, Equipement } from "../types/types"

export async function getListEquipement(logementId: number): Promise<{equipements: Array<Equipement>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/equipement")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const equipements = data

    return {
        equipements
    }
}

export async function createEquipement(logementId: number, createEquipement: CreateEquipement): Promise<Equipement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/equipement")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify({nom: createEquipement.nom, etat: createEquipement.etat})
    })

    const data = await response.json()
    return data
}

export async function updateEquipement(equipement: Equipement, logementId: number): Promise<Equipement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/equipement/"+equipement.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({nom: equipement.nom, etat: equipement.etat, logementId: logementId})
    })

    const data = await response.json()
    return data
}

export async function deleteEquipement(equipement: Equipement, logementId: number): Promise<Equipement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/equipement/"+equipement.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify({logementId: logementId})
    })

    const data = await response.json()
    return data
}