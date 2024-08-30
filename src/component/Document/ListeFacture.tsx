import { useEffect, useState } from "react"
//import { Facture } from "../types/types"
import { formatDateToLocalString } from "../../utils/utils-function"
//import { downloadFacture, getListFacture, getListMyFacture } from "../request/requestFacture"
import { useUserContext } from "../../main"
import { getListFacture, getListMyFacture, downloadFacture } from "../../request/requestFacture"
import { Facture } from "../../types/types"

export function ListeFacture() {
    const [facture, setFacture] = useState<Array<Facture>>([])
    const user = useUserContext()

    useEffect(() => {
        const fetchListFacture = async () => {
            if(user.user?.role.isAdmin) {
                const listFacture = (await getListFacture()).factures
                if(listFacture) {
                    setFacture(listFacture)
                }
            } else {
                const listFacture = (await getListMyFacture()).factures
                if(listFacture) {
                    setFacture(listFacture)
                }
            }
        }

        fetchListFacture()
    }, [user.user])

    const handleDownload = async (facture: Facture) => {
        await downloadFacture(facture)
    }

    return (
        <div className="div_detail"> 
            <div className="div_liste">
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info">Nom de la facture</label>
                    </div>
                    <div>
                        <label className="label_info">Numéro de la facture</label>
                    </div>
                    <div>
                        <label className="label_info">Nom</label>
                    </div>
                    <div>
                        <label className="label_info">Prénom</label>
                    </div>
                    <div>
                        <label className="label_info">Date de création</label>
                    </div>
                    <div>
                        <label className="label_info">Télécharger</label>
                    </div>
                </div>
            {facture.map((facture) => (
                <div key={facture.id} className="div_row" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info_classic">{facture.nomFacture}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{facture.numeroFacture}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{facture.nomPersonne}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{facture.prenom}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(facture.dateCreation)}</label>
                    </div>
                    <div>
                        <img src="/icone/download.png" className="icone_clickable" onClick={() => handleDownload(facture)}/>
                    </div>
                </div>))}
            </div>
        </div>
    )
}