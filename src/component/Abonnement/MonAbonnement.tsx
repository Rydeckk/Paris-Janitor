import { useEffect, useState } from "react"
import { Abonnement, Souscription } from "../../types/types"
import { useUserContext } from "../../main"
import { getMyActualSouscription } from "../../request/requestSouscription"
import { formatDateToLocalString } from "../../utils/utils-function"
import { Paiement } from "../Paiement"
import { getAbonnement, souscrireAbonnement } from "../../request/requestAbonnement"
import { SuccessPaiement } from "../SuccessPaiement"

export function MonAbonnement() {
    const [souscription, setSouscription] = useState<Souscription>()
    const [souscriptionCreated, setSouscriptionCreated] = useState<Souscription>()
    const [abonnement, setAbonnement] = useState<Abonnement>()
    const [isPaiement, setIsPaiement] = useState<boolean>(false)
    const [isSuccessPaye, setIsSuccessPaye] = useState<boolean>(false)
    const user = useUserContext()

    useEffect(() => {  
        const fetchMySouscription = async () => {
            const souscription = await getMyActualSouscription()
            if(souscription) {
                setSouscription(souscription)
            }
        }

        if(user.user?.role.isOwner) {
            fetchMySouscription()
        }

    }, [user.user])

    useEffect(() => {
        const fetchAbonnement = async () => {
            const abonnement = await getAbonnement()
            if(abonnement) {
                setAbonnement(abonnement)
            }
        }
        fetchAbonnement()
    }, [])

    const handlePaiementSuccess = async () => {
        const souscriptionCreated = await souscrireAbonnement()
        if(souscriptionCreated) {
            if(!souscription) {
                setSouscription(souscription)
            }
            setSouscriptionCreated(souscriptionCreated)
        }
        setIsPaiement(false)
        setIsSuccessPaye(true)
    }

    return (
        <div>
            {!isPaiement && !isSuccessPaye && (<div className="div_detail">
                <div className="div_liste">
                {souscription && (<>
                    <label className="title">Mon abonnement</label>
                    <div className="div_form">
                        <label>Date de début</label>
                        <input disabled={true} value={formatDateToLocalString(new Date(souscription.dateDebut))}></input>
                    </div>
                    <div className="div_form">
                        <label>Date de fin</label>
                        <input disabled={true} value={formatDateToLocalString(new Date(souscription.dateFin))}></input>
                    </div>
                    </>)}
                    {!souscription && (<label className="label_info">Aucun abonnement en cours</label>)}
                    <button className="button" onClick={() => setIsPaiement(true)}>{souscription ? "Prolonger" : "Renouveler"}</button>
                </div>
            </div>)}
            {abonnement && isPaiement && (<Paiement montant={abonnement.montant} onSuccess={() => handlePaiementSuccess()} onCancel={() => setIsPaiement(false)}/>)}
            {isSuccessPaye && souscriptionCreated && (<SuccessPaiement souscription={souscriptionCreated}/>)}
        </div>
    )
}