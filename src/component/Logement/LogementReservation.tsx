import { useEffect, useState } from "react";
import { Logement, Reservation, Service } from "../../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateToLocalString } from "../../utils/utils-function";
import { differenceEnJours } from "../../utils/utils-function";
import { ListeServices } from "./ListeServices";
import { AddServiceLogement } from "./AddServiceLogement";
import { addServiceReservation, createReservation, payeReservation } from "../../request/requestReservation";
import { Paiement } from "../Paiement";
import { SuccessPaiement } from "../SuccessPaiement";

interface LogementReservationProps {
    logement: Logement,
    onReturn: () => void,
    onUpdate: (logementUpdated: Logement) => void
}

export function LogementReservation({logement, onReturn, onUpdate}: LogementReservationProps) {
    const [dates, setDates] = useState<Date[]>([])
    const [nbNuits, setNbNuits] = useState<number>(0)
    const [servicesAdditionnel, setServicesAdditionnel] = useState<Service[]>([])
    const [isFormService, setIsFormService] = useState<boolean>(false)
    const [isFormPaye, setIsFormPaye] = useState<boolean>(false)
    const [isSuccessPaye, setIsSuccessPaye] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [reservation, setReservation] = useState<Reservation>()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        try {
            setDates(location.state.dates)
            if(location.state.dates.length > 1 ) {
                setNbNuits(differenceEnJours(location.state.dates[0], location.state.dates[1]))
            }
        } catch (error) {}

    }, [location.pathname])

    useEffect(() => {
        setTotal((logement.prixNuit * nbNuits) + logement.services.reduce((acc, service) => acc + service.prix, 0))
    }, [nbNuits])

    const handleClickAdd = () => {
        setIsFormService(true)
    }

    const handleDelete = (serviceDeleted: Service) => {
        setServicesAdditionnel(servicesAdditionnel.filter((service) => service.id !== serviceDeleted.id))
        setTotal(total - serviceDeleted.prix)
    }

    const handleAddService = (serviceAdded: Service) => {
        setServicesAdditionnel([...servicesAdditionnel,serviceAdded])
        setTotal(total + serviceAdded.prix)
        setIsFormService(false)
    }

    const handlePayeReservation = async () => {
        setIsFormPaye(true)
    }

    const handleSuccessPaiement = async () => {
        
        if(Array.isArray(dates)) {
            const reservationCreated = await createReservation({dateDebut: dates[0], dateFin: dates[1], montant: total, services: servicesAdditionnel.map((service) => service)}, logement.id)
            if(reservationCreated) {
                servicesAdditionnel.forEach(async (service) => {
                    await addServiceReservation(reservationCreated.id, service.id)
                })

                setReservation({...reservationCreated, services: servicesAdditionnel.map((service) => service)})

                const logementUpdated = logement
                logementUpdated.reservations = [...logementUpdated.reservations,reservationCreated]

                onUpdate(logementUpdated)
            }
        } else {
            const reservationCreated = await createReservation({dateDebut: dates[0], dateFin: dates[0], montant: total, services: servicesAdditionnel.map((service) => service)}, logement.id)
            if(reservationCreated) {
                servicesAdditionnel.forEach(async (service) => {
                    await addServiceReservation(reservationCreated.id, service.id)
                })

                setReservation({...reservationCreated, services: servicesAdditionnel.map((service) => service)})

                const logementUpdated = logement
                logementUpdated.reservations = [...logementUpdated.reservations,reservationCreated]

                onUpdate(logementUpdated)
            }
        }
        setIsFormPaye(false)
        setIsSuccessPaye(true)
    }

    return (
        <div>
            {!isFormPaye && !isSuccessPaye && (<div className="div_detail">
                <div className="div_logement_info" style={{height: "100%"}}>
                    <div className="div_liste">
                        <label className="title">Ma réservation</label>
                        <div className="div_liste">
                            <div className="div_form">
                                <label>Date de début</label>
                                <input disabled={true} value={formatDateToLocalString(new Date(dates[0]))}></input>
                            </div>
                            <div className="div_form">
                                <label>Date de fin</label>
                                <input disabled={true} value={dates.length > 1 ? formatDateToLocalString(new Date(dates[1])) : formatDateToLocalString(new Date(dates[0]))}></input>
                            </div>
                            <div className="div_form">
                                <label>Nombres de nuit</label>
                                <input disabled={true} value={nbNuits}></input>
                            </div>
                            <div className="div_form">
                                <label>Prix</label>
                                <input disabled={true} value={String(logement.prixNuit + " €/nuit * " + nbNuits + " nuits = " + (logement.prixNuit * nbNuits) + " €")}></input>
                            </div>
                        </div>
                        
                        <label className="title">Services du logement</label>
                        <div style={{width: "100%", marginBottom: "35px"}}>
                            <ListeServices services={logement.services}/>
                        </div>
                        <label className="title">Services additionnels</label>
                        <div style={isFormService ? {width: "100%", marginBottom: "35px"} : {width: "100%", marginBottom: "35px", padding: "5px 15px"}}>
                            {!isFormService && (<ListeServices services={servicesAdditionnel} onClickAdd={() => handleClickAdd()} onDelete={(serviceDeleted) => handleDelete(serviceDeleted)}/>)}
                            {isFormService && (<AddServiceLogement servicesActif={servicesAdditionnel} onAdd={(serviceAdded) => handleAddService(serviceAdded)} space="traveler"/>)}

                            {isFormService && (<div className="div_return">
                                <img src="/icone/return.png"></img>
                                <label onClick={() => setIsFormService(false)}>Services sélectionnés</label>
                            </div>)}
                        </div>
                        <label className="label_info"><b>Montant total TTC : </b> {total} €</label>
                        <button className="button" onClick={handlePayeReservation}>Réserver</button>
                    </div>
                </div>
            </div>)}
            {isFormPaye && (<Paiement montant={total} onSuccess={handleSuccessPaiement} onCancel={() => setIsFormPaye(false)}/>)}
            {isSuccessPaye && reservation && (<SuccessPaiement reservation={reservation}/>)}
            <div className="div_return">
                <img src="/icone/return.png"></img>
                <label onClick={() => onReturn()}>Retour à la liste</label>
            </div>
        </div>
        
    )
}
