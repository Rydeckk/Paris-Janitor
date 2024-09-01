import { useEffect, useState } from "react";
import { CreateEquipement, Equipement, EtatEquip, EtatEquipString } from "../../types/types";

interface PopupAddEquipementProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (equip: CreateEquipement) => void;
    equipUpdate?: Equipement
    onUpdate: (equipUpdated: Equipement) => void
}

export function PopupAddEquipement({isOpen, onClose, onAdd, equipUpdate, onUpdate}: PopupAddEquipementProps) {
    const [nom, setNom] = useState("")
    const [etat, setEtat] = useState<EtatEquip>("neuf")

    useEffect(() => {
        if(equipUpdate) {
            setNom(equipUpdate.nom)
            setEtat(equipUpdate.etat)
        }
    }, [equipUpdate])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(equipUpdate) {
            onUpdate({...equipUpdate, nom: nom, etat: etat})
            setNom("")
            setEtat("neuf")
        } else {
            onAdd({nom: nom, etat: etat})
            setNom("")
            setEtat("neuf")
        }
    }

    if (!isOpen) return null;

    return (
        <div className="popup_background">
            <div className="popup_content">
                <button className="close_popup" onClick={onClose}>&times;</button>
                <label className="title">{equipUpdate ? "Modification d'un équipement" : "Création d'un équipement"}</label> 
                <form onSubmit={handleSubmit}>
                    <div className="div_form">
                        <label>Nom de l'équipement</label>
                        <input value={nom} onChange={(e) => setNom(e.target.value)}></input>
                    </div>
                    <div className="div_form">
                        <label>Etat de l'équipement</label>
                        <select value={etat} onChange={(e) => setEtat(e.target.value as EtatEquip)}>
                            <option value={"neuf"}>{EtatEquipString["neuf"]}</option>
                            <option value={"tresBonEtat"}>{EtatEquipString["tresBonEtat"]}</option>
                            <option value={"bonEtat"}>{EtatEquipString["bonEtat"]}</option>
                            <option value={"etatUsage"}>{EtatEquipString["etatUsage"]}</option>
                            <option value={"mauvaisEtat"}>{EtatEquipString["mauvaisEtat"]}</option>
                        </select>
                    </div>
                    
                    {!equipUpdate && (<button className="button" type="submit" name="add">Ajouter</button>)}
                    {equipUpdate && (<button className="button" type="submit" name="edit">Modifier</button>)}
                </form>
            </div>
        </div>
    )
}