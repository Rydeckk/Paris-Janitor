import { useEffect, useState } from "react"
import { Bannissement } from "../../types/types"
import { formatDateToLocalString, getStatutSouscription } from "../../utils/utils-function"
import { getListBannissement } from "../../request/requestBannissement"

export function HistoriqueBannissement() {
    const [bannis, setBannis] = useState<Bannissement[]>([])

    useEffect(() => {
        const fetchBannis = async () => {
            const listeBannis = (await getListBannissement()).bannissements
            if(listeBannis) {
                setBannis(listeBannis)
            }
        }

        fetchBannis()
    }, [])

    return (
        <div className="div_detail" style={{ height: "800px"}}>
            <div className="div_liste">
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info">Nom</label>
                    </div>
                    <div>
                        <label className="label_info">Prénom</label>
                    </div>
                    <div>
                        <label className="label_info">Motif</label>
                    </div>
                    <div>
                        <label className="label_info">Date de début</label>
                    </div>
                    <div>
                        <label className="label_info">Date de fin</label>
                    </div>
                    <div>
                        <label className="label_info">Statut</label>
                    </div>
                </div>
            {bannis.map((bannis) => (
                <div key={bannis.id} className="div_row" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info_classic">{bannis.user.lastName}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{bannis.user.firstName}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{bannis.motif}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(bannis.dateDebut)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(bannis.dateFin)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{getStatutSouscription(bannis.dateDebut, bannis.dateFin)}</label>
                    </div>
                </div>))}
            </div>
        </div>
    )
}