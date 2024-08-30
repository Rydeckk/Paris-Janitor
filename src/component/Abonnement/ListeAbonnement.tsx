import { useEffect, useState } from "react";
import { Souscription } from "../../types/types";
import { useUserContext } from "../../main";
import { formatDateToLocalString, getStatutSouscription } from "../../utils/utils-function";
import { getListMySouscription } from "../../request/requestSouscription";

export function ListeAbonnement() {
    const [souscriptions, setSouscriptions] = useState<Souscription[]>([])
    const user = useUserContext()

    useEffect(() => {
        const fetchHistorique = async () => {
            const listeSouscriptions = await getListMySouscription()
            if(listeSouscriptions.souscriptions) {
                setSouscriptions(listeSouscriptions.souscriptions)
            }
        }

        fetchHistorique()
    }, [user.user])

    return (
        <div className="div_detail" style={{ height: "800px"}}>
            <div className="div_liste">
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
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
                        <label className="label_info">Statut</label>
                    </div>
                    <div>
                        <label className="label_info">Facture</label>
                    </div>
                </div>
            {souscriptions.map((souscription) => (
                <div key={souscription.id} className="div_row" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(souscription.dateDebut)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(souscription.dateFin)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{souscription.abonnement.montant} €</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{getStatutSouscription(souscription.dateDebut, souscription.dateFin)}</label>
                    </div>
                    <div>
                        <img src="/icone/download.png" className="icone_clickable"/>
                    </div>
                </div>))}
            </div>
        </div>
    )
}