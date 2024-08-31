import { useEffect, useState } from "react"
import { Abonnement } from "../../types/types"
import { getAbonnement, updateAbonnement } from "../../request/requestAbonnement"

export function AbonnementAdmin() {
    const [abonnement, setAbonnement] = useState<Abonnement>()
    const [titre, setTitre] = useState("")
    const [montant, setMontant] = useState(0)
    const [isEdition, setIsEdition] = useState(false)

    useEffect(() => {
        const fetchAbonnement = async () => {
            const abonnement = await getAbonnement()
            if(abonnement) {
                setAbonnement(abonnement)
                setTitre(abonnement.nom)
                setMontant(abonnement.montant)
            }
        }

        fetchAbonnement()
    }, [])

    const handleUpdateAbonnement = async () => {
        if(abonnement) {
            const updatedAbonnement = await updateAbonnement(abonnement.id, titre, montant)
            if(updatedAbonnement) {
                setAbonnement(updatedAbonnement)
                setIsEdition(false)
            }
        }
    }

    return (
        <div className="div_detail" style={{width: "50%", right: "28%", position: "absolute"}}>
            <div className="div_liste">
                <label className="title">Abonnement annuel</label>
                <div className="div_form">
                    <label>Titre</label>
                    <input value={titre} onChange={(e) => setTitre(e.target.value)} disabled={!isEdition}></input>
                </div>
                <div className="div_form">
                    <label>Montant (en €)</label>
                    <input value={montant} onChange={(e) => setMontant(+e.target.value)} disabled={!isEdition}></input>
                </div>
                <div className="div_flex_row">
                    {!isEdition && (<button className="button" onClick={() => setIsEdition(true)}>Modifier</button>)}
                    {isEdition && (<button className="button" onClick={() => handleUpdateAbonnement()}>Enregistrer</button>)}
                    {isEdition && (<button className="button" onClick={() => setIsEdition(false)}>Annuler</button>)}
                </div>
            </div>
        </div>
    )
}