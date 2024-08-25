import { useEffect, useState } from "react"
import { Devis } from "../types/types"
import { formatDateToLocalString } from "../utils/utils-function"
import { downloadDevis, getListDevis, getListMyDevis } from "../request/requestDevis"
import { useUserContext } from "../main"

export function ListeDevis() {
    const [devis, setDevis] = useState<Array<Devis>>([])
    const user = useUserContext()

    useEffect(() => {
        const fetchListDevis = async () => {
            if(user.user?.role.isAdmin) {
                setDevis((await getListDevis()).devis)
            } else {
                setDevis((await getListMyDevis()).devis)
            }
        }

        fetchListDevis()
    }, [])

    const handleDownload = async (devis: Devis) => {
        await downloadDevis(devis)
    }

    return (
        <div className="div_detail">
            <div className="div_logement_info"> 
                <div className="div_liste">
                    <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info">Nom du devis</label>
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
                {devis.map((devis) => (
                    <div key={devis.id} className="div_row" style={{justifyContent: "space-between"}}>
                        <div>
                            <label className="label_info">{devis.nomDevis}</label>
                        </div>
                        <div>
                            <label className="label_info">{devis.nomPersonne}</label>
                        </div>
                        <div>
                            <label className="label_info">{devis.prenom}</label>
                        </div>
                        <div>
                            <label className="label_info">{formatDateToLocalString(devis.dateCreation)}</label>
                        </div>
                        <div>
                            <img src="/icone/download.png" className="icone_clickable" onClick={() => handleDownload(devis)}/>
                        </div>
                    </div>))}
                </div>
            </div>
        </div>
    )
}