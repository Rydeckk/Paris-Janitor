import { useEffect, useState } from "react"
import { Note, Service } from "../../types/types"
import { deleteNote, getListNote, updateNote } from "../../request/requestNote"
import { useUserContext } from "../../main"
import { PopupUpdateNote } from "./PopupUpdateNote"

interface NoteServiceProps {
    service: Service
}

export function NoteService({service}: NoteServiceProps) {
    const [notes, setNotes] = useState<Note[]>([])
    const [noteSelected, setNoteSelected] = useState<Note>()
    const [isOpen, setIsOpen] = useState(false)
    const user = useUserContext()

    useEffect(() => {
        const fetchNotes = async () => {
            const listeNotes = (await getListNote(service.id)).notes
            if(listeNotes) {
                setNotes(listeNotes)
            }
        }

        fetchNotes()
    }, [])

    const handleClickUpdate = (noteUpdate: Note) => {
        setNoteSelected(noteUpdate)
        setIsOpen(true)
    }

    const handleUpdateNote = async (noteUpdate: Note) => {
        const noteUpdated = await updateNote(noteUpdate)
        if(noteUpdated) {
            setNotes(notes.map((note) => note.id === noteUpdated.id ? noteUpdated : note))
            setIsOpen(false)
        }
    }

    const handleDeleteNote = async (noteDelete: Note) => {
        const noteDeleted = await deleteNote(noteDelete)
        if(noteDeleted) {
            setNotes(notes.filter((note) => note.id !== noteDeleted.id))
        }
    }

    return (
        <div className="div_detail">
            <div className="div_liste">
                <label className="title">Notes du services</label>
                <label className="little_title">Information service</label>
                <div className="div_form">
                    <label>Titre</label>
                    <input disabled={true} value={service.nom}></input>
                </div>
                <div className="div_form">
                    <label>Montant</label>
                    <input disabled={true} value={service.prix + " €"}></input>
                </div>
                <div className="div_form">
                    <label>Note</label>
                    <input disabled={true} value={notes.length > 0 ? 
                        (notes.reduce((acc,note) => (+acc + +note.numero),0) / notes.length).toFixed(2) + " /5 (" + notes.length + ")"
                        : "Aucune note"}> 
                    </input>
                </div>
                <label className="little_title">Notes</label>
                {notes.map((note) => (
                    <div key={note.id} className="div_note">
                        <div className="div_button_note">
                            {user.user?.id === note.user.id && (<img src="/icone/crayon.png" onClick={() => handleClickUpdate(note)}></img>)}
                            {(user.user?.role.isAdmin || user.user?.id === note.user.id) && (<button onClick={() => handleDeleteNote(note)}>X</button>)}
                        </div>
                        <label className="label_info">{note.user.lastName + " " + note.user.firstName}</label>
                        <div>
                            <label className="label_info_classic">{note.titre}</label>
                            <label className="label_info_classic">{note.numero + " /5"}</label>
                        </div>
                        <div>
                            <label className="label_info_classic">{note.commentaire}</label>
                        </div>
                    </div>
                ))}
            </div>
            {isOpen && noteSelected && (<PopupUpdateNote isOpen={isOpen} onUpdate={(note) => handleUpdateNote(note)} onClose={() => setIsOpen(false)} note={noteSelected}/>)}
        </div>
    )
}