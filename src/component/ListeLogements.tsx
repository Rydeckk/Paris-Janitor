import React, { useEffect, useState } from "react";
import { Logement, StatutLogement, TypeUser } from "../types/types";
import { getListLogement, getListLogementValide, getListMyLogement } from "../request/requestLogement";
import { LogementComponent } from "./LogementComponent";
import { useUserContext } from "../main";
import { getTypeUser } from "../utils/utils-function";
import { LogementDetail } from "./LogementDetail";
import { useNavigate } from "react-router-dom";

interface ListeLogementsProps {
    statut?: StatutLogement
}

export function ListeLogements({statut}: ListeLogementsProps) {
    const [listeLogements, setListeLogements] = useState<Array<Logement>>([])
    const [typeCompte, setTypeCompte] = useState<TypeUser>("traveler")
    const [logement, setLogement] = useState<Logement>()
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if(user.user) {
            setTypeCompte(getTypeUser(user.user))
        }
    }, [user.user])

    useEffect(() => {
        const listLogement = async () => {
            if(typeCompte === "admin") {
                setListeLogements((await getListLogement(statut)).logements)
            } else if (typeCompte === "owner") {
                setListeLogements((await getListMyLogement()).logements)
            } else {
                setListeLogements((await getListLogementValide()).logements)
            }
        }

        listLogement()
    }, [typeCompte])

    const handleUpdate = (logementUpdate: Logement) => {
        setListeLogements(listeLogements.map((logement) => logement.id === logementUpdate.id ? logementUpdate : logement))
        setLogement(logementUpdate)
    }

    const handleReturn = () => {
        setLogement(undefined)
        navigate("/owner/logement")
    }

    return (
        <div>
            {!logement && (<div>
                <label className="title">Mes Logements</label>
                <div className="div_liste_horizontal">
                    {listeLogements.map((logement) => (
                        <LogementComponent key={logement.id} logement={logement} onClick={(logement) => setLogement(logement)}/>
                    ))}
                </div>
            </div>)}
            
            {logement && (<LogementDetail logement={logement} onUpdate={(logement) => handleUpdate(logement)} onReturn={() => handleReturn()}/>)}
        </div>
        
    )
}