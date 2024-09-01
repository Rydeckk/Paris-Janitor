import { useEffect, useState } from "react";
import { Note, Service, ServiceCreate, TypeService, typeServiceString, UserInfoWithId } from "../../types/types";
import { getListNote } from "../../request/requestNote";

interface PopupUpdateNoteProps {
    isOpen: boolean;
    onClose: () => void;
    note: Note
    onUpdate: (note: Note) => void
}

export function PopupUpdateNote({isOpen, onClose, note, onUpdate}: PopupUpdateNoteProps) {
    const [titre, setTitre] = useState(note.titre)
    const [numero, setNumero] = useState(note.numero)
    const [commentaire, setCommentaire] = useState(note.commentaire)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onUpdate({...note, titre: titre, numero: numero, commentaire: commentaire})

    }

    if (!isOpen) return null;

    return (
        <div className="popup_background">
            <div className="popup_content">
                <button className="close_popup" onClick={onClose}>&times;</button>
                <label className="title">Modification d'une note</label> 
                <form onSubmit={handleSubmit}>
                    <div className="div_form">
                        <label>Titre</label>
                        <input value={titre} onChange={(e) => setTitre(e.target.value)} required></input>
                    </div>
                    <div className="div_form">
                        <label>Note</label>
                        <select value={numero} onChange={(e) => setNumero(+e.target.value)} required>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>
                    <div className="div_form">
                        <label>Commentaire</label>
                        <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)}></textarea>
                    </div>
                    
                    <button className="button" type="submit">Modifier</button>
                </form>
            </div>
        </div>
    );
}