import { ChangeEvent, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Equipement, EtatEquip, EtatEquipString, Reservation } from "../../types/types"
import { createEtatLieu } from "../../request/requestEtatLieu"

export function EtatLieuForm() {
    const [equipements, setEquipements] = useState<Equipement[]>([])
    const [reservation, setReservation] = useState<Reservation>()
    const [type, setType] = useState<"entree" | "sortie">("entree")
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const equipements = location.state.equipements as Equipement[]
        setEquipements(equipements)
        const type = location.state.type as "entree" | "sortie"
        setType(type)
        const reservation = location.state.reservation as Reservation
        setReservation(reservation)
    }, [])

    const handleChangeEtat = (e: ChangeEvent<HTMLSelectElement>, equip: Equipement) => {
        setEquipements(equipements.map((equipement) => equipement.id === equip.id ? {...equip,etat: e.target.value as EtatEquip} : equipement))
    }

    const handleSave = async () => {
        if(reservation) {
            const etatLieuCreated = await createEtatLieu({reservationId: reservation.id, type: type, etatsEquipements: equipements.map((equip) => ({equipement: equip, etat : equip.etat}))})
            if(etatLieuCreated) {
                navigate("/master/etatLieu")
            }
        }
        
    }

    return (
        <div className="div_detail">
            <div className="div_liste">
                <label className="title">Etat des lieux</label>
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info">Equipement</label>
                    </div>
                    <div>
                        <label className="label_info">Etat</label>
                    </div>
                </div>
                {equipements.map((equip) => (
                    <div key={equip.id} className="div_row" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info_classic">{equip.nom}</label>
                        </div>
                        <div>
                            <select value={equip.etat} onChange={(e) => handleChangeEtat(e,equip)} className="select">
                                <option value={"neuf"}>{EtatEquipString["neuf"]}</option>
                                <option value={"tresBonEtat"}>{EtatEquipString["tresBonEtat"]}</option>
                                <option value={"bonEtat"}>{EtatEquipString["bonEtat"]}</option>
                                <option value={"etatUsage"}>{EtatEquipString["etatUsage"]}</option>
                                <option value={"mauvaisEtat"}>{EtatEquipString["mauvaisEtat"]}</option>
                            </select>
                        </div>
                    </div>
                ))}
                <button className="button" onClick={() => handleSave()}>Enregistrer</button>
            </div>
        </div>
    )
}