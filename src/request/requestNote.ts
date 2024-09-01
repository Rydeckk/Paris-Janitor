import { CreateNote, Note } from "../types/types"

export async function getListNote(serviceId: number): Promise<{notes: Array<Note>}> {
    const url = new URL(import.meta.env.VITE_URL_API+"/service/"+serviceId+"/note")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const notes = data

    return {
        notes
    }
}

export async function createNote(serviceId: number, createNote: CreateNote): Promise<Note | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/service/"+serviceId+"/note")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'POST',
    headers: headers,
    body: JSON.stringify({titre: createNote.titre, numero: createNote.numero, commentaire: createNote.commentaire})
    })

    const data = await response.json()
    return data
}

export async function updateNote(note: Note): Promise<Note | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/note/"+note.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({titre: note.titre, numero: note.numero, commentaire: note.commentaire})
    })

    const data = await response.json()
    return data
}

export async function deleteNote(note: Note): Promise<Note | null> {
    const url = new URL(import.meta.env.VITE_URL_API+"/note/"+note.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url, {
        
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
    return data
}