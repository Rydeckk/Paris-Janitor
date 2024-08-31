import { useEffect, useState } from "react";
import { Facture, Souscription } from "../../types/types";
import { useUserContext } from "../../main";
import { formatDateToLocalString, getStatutSouscription } from "../../utils/utils-function";
import { getListMySouscription, getListSouscription } from "../../request/requestSouscription";
import { downloadFacture } from "../../request/requestFacture";

export function ListeAbonnement() {
    const [souscriptions, setSouscriptions] = useState<Souscription[]>([])
    const user = useUserContext()

    useEffect(() => {
        const fetchHistorique = async () => {
            if(user.user?.role.isAdmin) {
                const listeSouscriptions = await getListSouscription()
                if(listeSouscriptions.souscriptions) {
                    setSouscriptions(listeSouscriptions.souscriptions)
                }
            } else {
                const listeSouscriptions = await getListMySouscription()
                if(listeSouscriptions.souscriptions) {
                    setSouscriptions(listeSouscriptions.souscriptions)
                }
            }
        }

        fetchHistorique()
    }, [user.user])

    const handleDownload = async (facture: Facture) => {
        await downloadFacture(facture)
    }

    return (
        <div className="div_detail" style={{ height: "800px"}}>
            <div className="div_liste">
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    {user.user?.role.isAdmin && (<div>
                        <label className="label_info">Nom</label>
                    </div>)}
                    {user.user?.role.isAdmin && (<div>
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
                        <label className="label_info">Statut</label>
                    </div>
                    <div>
                        <label className="label_info">Facture</label>
                    </div>
                </div>
            {souscriptions.map((souscription) => (
                <div key={souscription.id} className="div_row" style={{justifyContent: "space-between"}}>
                    {user.user?.role.isAdmin && (<div>
                        <label className="label_info_classic">{souscription.user.lastName}</label>
                    </div>)}
                    {user.user?.role.isAdmin && (<div>
                        <label className="label_info_classic">{souscription.user.firstName}</label>
                    </div>)}
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(souscription.dateDebut)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(souscription.dateFin)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{souscription.montant} €</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{getStatutSouscription(souscription.dateDebut, souscription.dateFin)}</label>
                    </div>
                    <div>
                        <img src="/icone/download.png" className="icone_clickable" onClick={() => handleDownload(souscription.facture)}/>
                    </div>
                </div>))}
            </div>
        </div>
    )
}