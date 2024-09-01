import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../main"
import { Equipement, EtatLieu, Logement, Reservation } from "../../types/types"
import {  formatDateToLocalString } from "../../utils/utils-function"
import { downloadEtatLieu, getListEtatLieu, getListEtatLieuLogement } from "../../request/requestEtatLieu"
import { getListReservationEtatLieu } from "../../request/requestReservation"

interface ListEtatLieuxToDoProps {
    type: "sortie" | "entree"
}

export function ListEtatLieuxToDo({type}: ListEtatLieuxToDoProps) {
    const [reservations, setReservations] = useState<Reservation[]>([])
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchReservationEtatLieux = async () => {
            const listeReservation = (await getListReservationEtatLieu(type)).reservations
            if(listeReservation) {
                setReservations(listeReservation)
            }
        }

        fetchReservationEtatLieux()
    }, [type])

    const handleClickEtatLieu = async (reservation: Reservation, equipements: Equipement[]) => {
        navigate("/master/etatLieu/form", {state: {reservation: reservation, equipements: equipements, type: type}})
    }

    return (
        <div>
            <div className="div_detail" style={{ height: "800px"}}>
                <div className="div_liste">
                    <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info">{type === "entree" ? "Date de debut" : "Date de fin"}</label>
                        </div>
                        <div>
                            <label className="label_info">Nom</label>
                        </div>
                        <div>
                            <label className="label_info">Prénom</label>
                        </div>
                        <div>
                            <label className="label_info">Compléter</label>
                        </div>
                    </div>
                {reservations.map((reservation) => (
                    <div key={reservation.id} className="div_row" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info_classic">{formatDateToLocalString(type === "entree" ? reservation.dateDebut : reservation.dateFin)}</label>
                        </div>
                        <div>
                            <label className="label_info_classic">{reservation.user.lastName}</label>
                        </div>
                        <div>
                            <label className="label_info_classic">{reservation.user.firstName}</label>
                        </div>
                        <div>
                            <img src="/icone/crayon.png" className="icone_clickable" onClick={() => handleClickEtatLieu(reservation, reservation.logement.equipements)}/>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>
    )
}