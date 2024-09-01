import React, { useEffect } from "react";
import { Logement, statutColors } from "../../types/types";
import { useUserContext } from "../../main";

interface LogementProps {
    logement: Logement,
    onClick: (logement: Logement) => void
}

export function LogementComponent({logement, onClick}: LogementProps) {
    const user = useUserContext()

    const handleClick = () => {
        onClick(logement)
    }

    return (
        <div className="card_logement" onClick={handleClick}>
            {user.user && user.user.role.isOwner && (<div className="div_statut" style={logement.isActif ? {backgroundColor: statutColors[logement.statut]} : {backgroundColor: "rgba(0, 0, 0, 0.2)"} }>
            </div>)}
            <img src={logement.photos.length > 0 ? import.meta.env.VITE_URL_API+logement.photos[0].path : "/icone/image.png"}></img>
            <div className="card_logement_div_title">
                <label className="label_card">{logement.nom}</label>
            </div>
        </div>
    )
}