import { Abonnement, Souscription } from "../types/types"

export async function getAbonnement(): Promise<Abonnement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/abonnement/1")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    return data
}

export async function souscrireAbonnement(): Promise<Souscription | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/abonnement/1/souscrire")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers
    })

    const data = await response.json()
    return data
}

export async function updateAbonnement(id: number, titre: string, montant: number): Promise<Abonnement | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/abonnement/"+id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({id: id, nom: titre, montant: montant})
    })

    const data = await response.json()
    return data
}