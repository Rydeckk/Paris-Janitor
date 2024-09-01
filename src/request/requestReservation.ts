import { CreateReservation, Reservation } from "../types/types"

export async function createReservation(createReservation: CreateReservation, logementId: number): Promise <Reservation | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/reservation")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify(createReservation)
    })

    const data = await response.json()
    return data
}

export async function getListReservation(): Promise<{reservations: Array<Reservation>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/reservation")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const reservations = data

    return reservations || []
}

export async function getListMyReservation(): Promise<{reservations: Array<Reservation>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/myReservation?")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const reservations = data

    return reservations || []
}

export async function getListReservationLogement(logementId: number): Promise<{reservations: Array<Reservation>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/reservation")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const reservations = data

    return reservations || []
}

export async function addServiceReservation(reservationId: number, serviceId: number): Promise <Reservation | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/reservation/"+reservationId+"/service/"+serviceId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers
    })

    const data = await response.json()
    return data
} 

export async function removeServiceReservation(reservationId: number, serviceId: number): Promise <Reservation | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/reservation/"+reservationId+"/service/"+serviceId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
    return data
} 

export async function payeReservation(montant: number) {
    const url = new URL(import.meta.env.VITE_URL_API+"/reservation/paye")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify({montant})
    })

    const data = await response.json()
    return data
} 

export async function getListReservationEtatLieu(type: "entree" | "sortie"): Promise<{reservations: Array<Reservation>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/reservationEtatLieu")
    url.searchParams.append("type",type)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const reservations = data

    return {
        reservations
    }
}