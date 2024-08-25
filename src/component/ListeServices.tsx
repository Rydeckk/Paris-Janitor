import { useState } from "react";
import { Service } from "../types/types";
import { useUserContext } from "../main";

interface ListeServiceProps {
    services?: Service[]
    onClickAdd?: () => void
    onDelete?: (service: Service) => void
}

export function ListeServices({services, onClickAdd, onDelete}: ListeServiceProps) {
    const user = useUserContext()

    return (
        <div className="div_liste">
            {onClickAdd && (<div className="div_img_button" onClick={onClickAdd}>
                <img src="/icone/add.png"></img> 
                <label>Ajouter un service</label>
            </div>)}
            
            {services && services.length > 0 ? services.map((service) => (
                <div key={service.id} className="div_liste">
                    <div className="div_row">
                        {onDelete && (<button className="button_delete" onClick={() => onDelete(service)}>X</button>)}
                        <label className="label_info">{service.nom}</label>
                        <label className="label_info" style={{fontWeight: "bold"}}>{service.prix} €</label>
                    </div>
                </div>    
            )): (
                user.user?.role.isOwner ? (<label>Aucun services pour ce logement</label>)
                : (<label>Aucun services additionnel</label>)
            )}
        </div>
        
    )
}