import { useState } from "react";
import { Service } from "../types/types";

interface ListeServiceProps {
    services?: Service[]
    onClickAdd: () => void
    onDelete: (service: Service) => void
}

export function ListeServices({services, onClickAdd, onDelete}: ListeServiceProps) {
    return (
        <div className="div_liste">
            <div className="div_img_button" onClick={onClickAdd}>
                <img src="/icone/add.png"></img> 
                <label>Ajouter un service</label>
            </div>
            
            {services && services.length > 0 ? services.map((service) => (
                <div key={service.id} className="div_liste">
                    <div className="div_row">
                        <button className="button_delete" onClick={() => onDelete(service)}>X</button>
                        <label className="label_info">{service.nom}</label>
                        <label className="label_info" style={{fontWeight: "bold"}}>{service.prix} €</label>
                    </div>
                </div>    
            )): (
                <label>Aucun services pour ce logement</label>
            )}
        </div>
        
    )
}