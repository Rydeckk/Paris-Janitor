import { useEffect, useState } from "react";
import { Bannissement, CreateBannissement, Role, Service, ServiceCreate, TypeService, typeServiceString, UserInfoWithId } from "../../types/types";
import { getListRole } from "../../request/requestRole";
import { formatDateToLocalISOString } from "../../utils/utils-function";

interface PopupBannissementProps {
    isOpen: boolean;
    onClose: () => void
    user: UserInfoWithId
    onAdd?: (user: UserInfoWithId, bannissement: CreateBannissement) => void
    bannissement?: Bannissement
    onUpdate?: (user: UserInfoWithId, bannissementUpdate: Bannissement) => void
}

export function PopupBannissement({isOpen, onClose, user, onAdd, bannissement, onUpdate}: PopupBannissementProps) {
    const [motif, setMotif] = useState("")
    const [dateFin, setDateFin] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if(bannissement) {
            setMotif(bannissement.motif)
            setDateFin(formatDateToLocalISOString(bannissement.dateFin))
        }
    
    }, [bannissement])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if(new Date(dateFin) < new Date()) {
            setError("La date de fin ne doit pas être inférieur à aujourd'hui")
            return
        }

        if(bannissement && onUpdate) {
            onUpdate(user, {...bannissement, motif: motif, dateFin: new Date(dateFin)})
        } else {
            if(onAdd) {
                onAdd(user,{motif: motif, dateDebut: new Date(), dateFin: new Date(dateFin)})
            }
            
        }
    }

    if (!isOpen) return null;

    return (
        <div className="popup_background">
            <div className="popup_content">
                <button className="close_popup" onClick={onClose}>&times;</button>
                <label className="title">Bannir un utilisateur</label> 
                <form onSubmit={handleSubmit}>
                    <div className="div_form">
                        <label>Motif</label>
                        <input value={motif} onChange={(e) => setMotif(e.target.value)}></input>
                    </div>
                    <div className="div_form">
                        <label>Date de fin</label>
                        <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)}></input>
                    </div>
                    {error && (<label className="label_error">{error}</label>)}
                    
                    {!bannissement && (<button className="button" type="submit">Bannir</button>)}
                    {bannissement && (<button className="button" type="submit">Modifier</button>)}
                </form>
            </div>
        </div>
    );
}