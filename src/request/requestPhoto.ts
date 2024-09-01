import { Photo } from "../types/types";

export async function uploadPhoto(logementId: number, image: File): Promise <Photo | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/photo")
    const formdata = new FormData()
    formdata.append("image",image)
    const headers = new Headers({'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url , {
    
    method: 'POST',
    headers: headers,
    body: formdata
    })

    const data = await response.json()
    
    return data
}

export async function deletePhoto(photoId: number, logementId: number): Promise <Photo | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/logement/"+logementId+"/photo/"+photoId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
    return data
}