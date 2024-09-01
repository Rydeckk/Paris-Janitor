import { useEffect, useState } from "react";
import { Service, ServiceCreate, TypeService, typeServiceString } from "../../types/types";

interface PopupAddServiceProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (service: ServiceCreate) => void;
    serviceUpdate?: Service
    onUpdate: (serviceUpdated: Service) => void
}

export function PopupAddService({isOpen, onClose, onAdd, serviceUpdate, onUpdate}: PopupAddServiceProps) {
    const [titre, setTitre] = useState("")
    const [type, setType] = useState<TypeService>("owner")
    const [montant, setMontant] = useState(0)

    useEffect(() => {
        if(serviceUpdate) {
            setTitre(serviceUpdate.nom)
            setMontant(serviceUpdate.prix)
            setType(serviceUpdate.type)
        }
    }, [serviceUpdate])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(serviceUpdate) {
            onUpdate({...serviceUpdate, nom: titre, type: type, prix: montant})
        } else {
            onAdd({nom: titre, type: type, prix: montant})
        }
    }

    if (!isOpen) return null;

    return (
        <div className="popup_background">
            <div className="popup_content">
                <button className="close_popup" onClick={onClose}>&times;</button>
                <label className="title">{serviceUpdate ? "Modification d'un service" : "Création d'un service"}</label> 
                <form onSubmit={handleSubmit}>
                    <div className="div_form">
                        <label>Titre du service</label>
                        <input value={titre} onChange={(e) => setTitre(e.target.value)}></input>
                    </div>
                    <div className="div_form">
                        <label>Le service sera destiné au</label>
                        <select value={type} onChange={(e) => setType(e.target.value as TypeService)}>
                            <option value={"traveler"}>{typeServiceString["traveler"]}</option>
                            <option value={"owner"}>{typeServiceString["owner"]}</option>
                        </select>
                    </div>
                    <div className="div_form">
                        <label>Montant du service (en €)</label>
                        <input value={montant} onChange={(e) => setMontant(+e.target.value)}></input>
                    </div>
                    
                    {!serviceUpdate && (<button className="button" type="submit" name="add">Ajouter</button>)}
                    {serviceUpdate && (<button className="button" type="submit" name="edit">Modifier</button>)}
                </form>
            </div>
        </div>
    );
}