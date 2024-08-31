import React, { useEffect, useState } from "react";
import { Logement, Souscription, StatutLogement, TypeUser } from "../../types/types";
import { getListLogement, getListLogementValide, getListMyLogement } from "../../request/requestLogement";
import { LogementComponent } from "./LogementComponent";
import { useUserContext } from "../../main";
import { getTypeUser } from "../../utils/utils-function";
import { LogementDetail } from "./LogementDetail";
import { useNavigate } from "react-router-dom";
import { getMyActualSouscription } from "../../request/requestSouscription";

interface ListeLogementsProps {
    statut?: StatutLogement
}

export function ListeLogements({statut}: ListeLogementsProps) {
    const [listeLogements, setListeLogements] = useState<Array<Logement>>([])
    const [typeCompte, setTypeCompte] = useState<TypeUser>("traveler")
    const [logement, setLogement] = useState<Logement>()
    const [souscription, setSouscription] = useState<Souscription>()
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
    }, [typeCompte, statut])

    useEffect(() => {  
        const fetchMySouscription = async () => {
            const souscription = await getMyActualSouscription()
            if(souscription) {
                setSouscription(souscription)
            }
        }

        fetchMySouscription()
    }, [user.user])

    const handleUpdate = (logementUpdate: Logement) => {
        setListeLogements(listeLogements.map((logement) => logement.id === logementUpdate.id ? logementUpdate : logement))
        setLogement(logementUpdate)
    }

    const handleReturn = () => {
        setLogement(undefined)
        if(typeCompte === "admin") {
            navigate("/master/logement")
        } else if (typeCompte === "owner") {
            navigate("/owner/logement")
        } else {
            navigate("/logement")
        }
        
    }

    return (
        <div>
            {!souscription && user.user?.role.isOwner && !user.user.role.isAdmin && (<label className="label_info">Vous devez payer votre cotisation pour rendre actif vos logements !</label>)}
            {!logement && (<div>
                <label className="title">{user.user?.role.isAdmin ? "Liste des logements" : (user.user?.role.isOwner ? "Mes Logements" : "Logements disponibles")}</label>
                <div className="div_liste_horizontal">
                    {statut && statut === "attenteValidation" && (<label className="label_info">Aucun logement en attente de validation</label>)}
                    {listeLogements.map((logement) => (
                        <LogementComponent key={logement.id} logement={logement} onClick={(logement) => setLogement(logement)}/>
                    ))}
                </div>
            </div>)}
            
            {logement && (<LogementDetail logement={logement} onUpdate={(logement) => handleUpdate(logement)} onReturn={() => handleReturn()}/>)}
        </div>
        
    )
}