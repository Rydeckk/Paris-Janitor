import { useEffect, useState } from "react"
import { useUserContext } from "../main"
import { Reservation, Souscription } from "../types/types"
import { differenceEnJours, formatDateToLocalString } from "../utils/utils-function"
import { AddServiceLogement } from "./Logement/AddServiceLogement"
import { ListeServices } from "./Logement/ListeServices"
import { sendMailFacture, sendMailFactureReservation } from "../request/requestMail"

interface SuccessPaiementProps {
    reservation?: Reservation,
    souscription?: Souscription
}

export function SuccessPaiement({reservation, souscription}: SuccessPaiementProps) {
    const [nbNuits, setNbNuits] = useState(0)
    const user = useUserContext()

    useEffect(() => {
        if(reservation) {
            setNbNuits(differenceEnJours(reservation.dateDebut, reservation.dateFin))
        }
    }, [reservation])

    const handleSendMail = async () => {
        if(reservation) {
            await sendMailFactureReservation(reservation.facture.id)
        }

        if(souscription) {
            await sendMailFacture(souscription.facture.id)
        }
    }

    return (
        <div className="div_detail">
            <div className="div_liste">
                <label className="title">{reservation ? "Votre réservation a bien été pris en compte !" : "Merci pour votre achat !"}</label>
                {reservation && (<>
                    <label className="label_info">Résumé de votre réservation</label>
                    <div className="div_liste">
                        <div className="div_form">
                            <label>Date de début</label>
                            <input disabled={true} value={formatDateToLocalString(new Date(reservation.dateDebut))}></input>
                        </div>
                        <div className="div_form">
                            <label>Date de fin</label>
                            <input disabled={true} value={formatDateToLocalString(new Date(reservation.dateFin))}></input>
                        </div>
                        <div className="div_form">
                            <label>Nombres de nuit</label>
                            <input disabled={true} value={nbNuits}></input>
                        </div>
                        <div className="div_form">
                            <label>Prix</label>
                            <input disabled={true} value={String(reservation.logement.prixNuit + " €/nuit * " + nbNuits + " nuits = " + (reservation.logement.prixNuit * nbNuits) + " €")}></input>
                        </div>
                    </div>
                    <label className="label_info">Services du logement</label>
                    <div style={{width: "100%", marginBottom: "35px"}}>
                        <ListeServices services={reservation.logement.services}/>
                    </div>
                    <label className="label_info">Services additionnels</label>
                    <div style={{width: "100%", marginBottom: "35px"}}>
                        <ListeServices services={reservation.services}/>
                    </div>
                    <label className="label_info"><b>Montant total TTC : </b> {reservation.montant} €</label>
                </>)}
                {souscription && (<>
                    <label className="label_info">Résumé de votre souscription</label>
                    <div className="div_liste">
                        <div className="div_form">
                            <label>Date de début</label>
                            <input disabled={true} value={formatDateToLocalString(new Date(souscription.dateDebut))}></input>
                        </div>
                        <div className="div_form">
                            <label>Date de fin</label>
                            <input disabled={true} value={formatDateToLocalString(new Date(souscription.dateFin))}></input>
                        </div>
                        <div className="div_form">
                            <label>Prix</label>
                            <input disabled={true} value={String(souscription.abonnement.montant) + " €"}></input>
                        </div>
                    </div>
                </>)}
                <button className="button" onClick={handleSendMail}>Envoyer facture par mail</button>
            </div>
        </div>
    )
}