import { DevisData } from "../types/types";

export async function sendMailDevis(devisId: number, email: string) {
    const url = new URL(import.meta.env.VITE_URL_API+"/mail/devis")
    const headers = new Headers({'Content-Type': 'application/json'})
    const response = await fetch(url.toString(), {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify({devisId: devisId, email: email})
    })
}