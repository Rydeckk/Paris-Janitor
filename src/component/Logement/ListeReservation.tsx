import { useEffect, useState } from "react"
import { Facture, Logement, Reservation, Service } from "../../types/types"
import { dateIsPasse, differenceEnJours, formatDateToLocalString } from "../../utils/utils-function"
import { useUserContext } from "../../main"
import { getListMyReservation, getListReservation, getListReservationLogement } from "../../request/requestReservation"
import { downloadFacture } from "../../request/requestFacture"
import { useNavigate } from "react-router-dom"

interface ListeReservationProps {
    logement?: Logement
}

export function ListeReservation({logement}:ListeReservationProps) {
    const [reservations, setReservations] = useState<Array<Reservation>>([])
    const [total, setTotal] = useState<number>(0)
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchListReservations = async () => {
            if(user.user?.role.isAdmin) {
                if(logement) {
                    const listReservation = (await getListReservationLogement(logement.id)).reservations
                    if(listReservation) {
                        setReservations(listReservation)
                    }
                    
                } else {
                    setReservations((await getListReservation()).reservations)
                }
                
            } else if (user.user?.role.isOwner) {
                if(logement) {
                    
                    const listReservation = (await getListReservationLogement(logement.id)).reservations
                    setReservations(listReservation)
                }
            } else {
                setReservations((await getListMyReservation()).reservations)
            }
        }

        fetchListReservations()
    }, [])

    useEffect(() => {
        if(reservations.length > 0 && logement) {
            let total = 0
            reservations.forEach((reservation) => {
                const nbNuits = differenceEnJours(reservation.dateDebut,reservation.dateFin)
                total += (logement.prixNuit * nbNuits)
            })
            setTotal(total)
        }
    }, [reservations])

    const handleDownload = async (facture: Facture) => {
        await downloadFacture(facture)
    }

    const handleNote = async (services: Service[]) => {
        navigate("/service/addnote", {state: {services: services}})
    }

    return (
        <div className="div_detail" style={{ height: "800px"}}>
            <div className="div_liste">
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    {!logement && (<div>
                        <label className="label_info">Nom du logement</label>
                    </div>)}
                    {logement && (<div>
                        <label className="label_info">Nom</label>
                    </div>)}
                    {logement && (<div>
                        <label className="label_info">Prénom</label>
                    </div>)}
                    <div>
                        <label className="label_info">Date de début</label>
                    </div>
                    <div>
                        <label className="label_info">Date de fin</label>
                    </div>
                    <div>
                        <label className="label_info">Montant</label>
                    </div>
                    <div>
                        <label className="label_info">Services additionnels</label>
                    </div>
                    {!user.user?.role.isAdmin && !user.user?.role.isOwner && (<div>
                        <label className="label_info">Noter</label>
                    </div>)}
                    <div>
                        <label className="label_info">Facture</label>
                    </div>
                </div>
            {reservations.map((reservation) => (
                <div key={reservation.id} className="div_row" style={{justifyContent: "space-between"}}>
                    {!logement && (<div>
                        <label className="label_info_classic">{reservation.logement.nom}</label>
                    </div>)}
                    {logement && (<div>
                        <label className="label_info_classic">{reservation.user.lastName}</label>
                    </div>)}
                    {logement && (<div>
                        <label className="label_info_classic">{reservation.user.firstName}</label>
                    </div>)}
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(reservation.dateDebut)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(reservation.dateFin)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{reservation.montant} €</label>
                    </div>
                    <div>
                        <div className="div_list_in_row">
                            {reservation.services.map((service) => (
                                <label key={service.id} className="label_info_classic">{service.nom}</label>
                            ))}
                        </div>
                    </div>
                    {!user.user?.role.isAdmin && !user.user?.role.isOwner && (<div>
                        {dateIsPasse(reservation.dateDebut, reservation.dateFin) && (<img src="/icone/star.png" className="icone_clickable" onClick={() => handleNote(reservation.services)}/>)}
                    </div>)}
                    <div>
                        <img src="/icone/download.png" className="icone_clickable" onClick={() => handleDownload(reservation.facture)}/>
                    </div>
                </div>))}
                {user.user?.role.isOwner && (<label className="label_info"><b>Montant prélevé par Paris Janitor TTC</b> : {(total * 0.2)} €</label>)}
                {user.user?.role.isOwner && (<label className="label_info"><b>Montant récupéré par le logement TTC</b> : {(total * 0.8)} €</label>)}
            </div>
        </div>
    )
}