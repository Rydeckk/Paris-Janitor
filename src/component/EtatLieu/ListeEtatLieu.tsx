import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "../../main"
import { EtatLieu, Logement, Reservation } from "../../types/types"
import {  formatDateToLocalString } from "../../utils/utils-function"
import { downloadEtatLieu, getListEtatLieu, getListEtatLieuLogement } from "../../request/requestEtatLieu"

interface ListeEtatLieuProps {
    logement?: Logement,
    onReturn?: () => void
}

export function ListeEtatLieu({logement, onReturn}: ListeEtatLieuProps) {
    const [etatLieux, setEtatLieux] = useState<Array<EtatLieu>>([])
    const user = useUserContext()

    useEffect(() => {
        const fetchListEtatLieux = async () => {
            if(logement) {
                const listeEtatLieux = (await getListEtatLieuLogement(logement.id)).etatLieux
                if(listeEtatLieux) {
                    setEtatLieux(listeEtatLieux)
                }
            } else {
                if(user.user?.role.isAdmin) {
                    const listeEtatLieux = (await getListEtatLieu()).etatLieux
                    if(listeEtatLieux) {
                        setEtatLieux(listeEtatLieux)
                    }
                }
            }
        }

        fetchListEtatLieux()
    }, [user.user, logement])

    const handleDownload = async (etatLieu: EtatLieu) => {
        await downloadEtatLieu(etatLieu)
    }

    return (
        <div>
            <div className="div_detail" style={{ height: "800px"}}>
                <div className="div_liste">
                    <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info">Nom de l'état des lieux</label>
                        </div>
                        <div>
                            <label className="label_info">Nom</label>
                        </div>
                        <div>
                            <label className="label_info">Prénom</label>
                        </div>
                        <div>
                            <label className="label_info">Date effectué</label>
                        </div>
                        <div>
                            <label className="label_info">Type</label>
                        </div>
                        <div>
                            <label className="label_info">Télécharger</label>
                        </div>
                    </div>
                {etatLieux.map((etatLieu) => (
                    <div key={etatLieu.id} className="div_row" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info_classic">{etatLieu.nomEtatLieu}</label>
                        </div>
                        <div>
                            <label className="label_info_classic">{etatLieu.nom}</label>
                        </div>
                        <div>
                            <label className="label_info_classic">{etatLieu.prenom}</label>
                        </div>
                        <div>
                            <label className="label_info_classic">{formatDateToLocalString(etatLieu.dateCreation)}</label>
                        </div>
                        <div>
                            <label className="label_info_classic">{etatLieu.reservationEntree ? "Entrée" : "Sortie"}</label>
                        </div>
                        <div>
                            <img src="/icone/download.png" className="icone_clickable" onClick={() => handleDownload(etatLieu)}/>
                        </div>
                    </div>))}
                </div>
            </div>
            {onReturn && (<div className="div_return">
                <img src="/icone/return.png"></img>
                <label onClick={() => onReturn()}>Retour à la liste</label>
            </div>)}
        </div>
    )
}