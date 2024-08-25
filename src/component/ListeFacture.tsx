import { useEffect, useState } from "react"
//import { Facture } from "../types/types"
import { formatDateToLocalString } from "../utils/utils-function"
//import { downloadFacture, getListFacture, getListMyFacture } from "../request/requestFacture"
import { useUserContext } from "../main"

export function ListeFacture() {
    //const [facture, setFacture] = useState<Array<Facture>>([])
    const user = useUserContext()

    // useEffect(() => {
    //     const fetchListFacture = async () => {
    //         if(user.user?.role.isAdmin) {
    //             setFacture((await getListFacture()).facture)
    //         } else {
    //             setFacture((await getListMyFacture()).facture)
    //         }
    //     }

    //     fetchListFacture()
    // }, [])

    // const handleDownload = async (facture: Facture) => {
    //     await downloadFacture(facture)
    // }

    return (
        <div className="div_detail">
            <div className="div_logement_info"> 
                <div className="div_liste">
                    <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info">Nom de la facture</label>
                        </div>
                        <div>
                            <label className="label_info">Numéro de la facture</label>
                        </div>
                        <div>
                            <label className="label_info">Nom de la personne</label>
                        </div>
                        <div>
                            <label className="label_info">Prénom de la personne</label>
                        </div>
                        <div>
                            <label className="label_info">Date de création</label>
                        </div>
                        <div>
                            <label className="label_info">Télécharger</label>
                        </div>
                    </div>
                {/* {facture.map((facture) => (
                    <div key={facture.id} className="div_row" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info">{facture.nomFacture}</label>
                        </div>
                        <div>
                            <label className="label_info">{facture.nomPersonne}</label>
                        </div>
                        <div>
                            <label className="label_info">{facture.prenom}</label>
                        </div>
                        <div>
                            <label className="label_info">{formatDateToLocalString(facture.dateCreation)}</label>
                        </div>
                        <div>
                            <img src="/icone/download.png" className="icone_clickable" onClick={() => handleDownload(facture)}/>
                        </div>
                    </div>))} */}
                </div>
            </div>
        </div>
    )
}