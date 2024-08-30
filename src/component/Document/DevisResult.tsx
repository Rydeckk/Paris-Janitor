import { useEffect, useState } from "react";
import { Devis, DevisData, typeBienString, typeLocationString } from "../../types/types";
import { useUserContext } from "../../main";
import { useNavigate } from "react-router-dom";
import { createLogement, addServiceLogement } from "../../request/requestLogement";
import { sendMailDevis } from "../../request/requestMail";
import { createDevis, createDevisNonConnecte } from "../../request/requestDevis";

interface DevisResultProps {
    devisData: DevisData
    onUpdate: () => void
}

export function DevisResult({devisData, onUpdate}: DevisResultProps) {
    const [total, setTotal] = useState<number>(0)
    const [devis, SetDevis] = useState<Devis>()
    const [isVisibleButtonMail, setIsVisibleButtonMail] = useState<boolean>(true)
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        let total = 0
        total += devisData.prixNuit * 0.2
        devisData.services.forEach((service) => total += service.prix)
        //Prix abonnement (à récupérer par la suite en base)
        total += 100 

        setTotal(total)
    }, [devisData])

    useEffect(() => {
        const createDevisRequest = async () => {
            if(user.user) {
                const devisCreated = await createDevis({...devisData, total: total})
                if(devisCreated) {
                    SetDevis(devisCreated)
                }
                
            } else {
                const devisCreated = await createDevisNonConnecte({...devisData, total: total})
                if(devisCreated) {
                    SetDevis(devisCreated)
                }
            }
        }
        
        if(total) {
            createDevisRequest()
        }
        
    }, [devisData, total])

    const handleLogin = () => {
        navigate("/owner/login", {state: {devisData: {...devisData, total: total}}})
    }

    const handleSignUp = () => {
        navigate("/owner/signup", {state: {devisData: {...devisData, total: total}}})
    }

    const handleCreateLogement = async () => {
        const logementCreated = await createLogement({
            nom: devisData.typeBien,
            adresse: devisData.adresse,
            codePostal: devisData.codePostal,
            ville: devisData.ville,
            pays: devisData.pays,
            typeLogement: devisData.typeBien,
            typeLocation: devisData.typeLocation,
            nbChambres: devisData.nbChambres,
            capacite: devisData.capacite,
            surface: devisData.surface,
            prixNuit: devisData.prixNuit
        })

        if(logementCreated) {
            devisData.services.forEach(async (service) => {
                await addServiceLogement(logementCreated.id, service.id)
            })

            navigate("/owner/logement")
        }
    }

    const handleClickSendMail = async () => {
        if(devis) {
            await sendMailDevis(devis.id, devisData.email)
            setIsVisibleButtonMail(false)
        }
    }

    return (
        <div className="div_devis">
            <div className="div_devis_content">
                <label className="title">Mon devis</label>
                <span className="span"></span>

                <div className="div_devis_bloc">
                    <label className="little_title">Résumé de votre logement</label>
                </div>
                
                <div className="div_logement_info">
                    <div className="div_logement_info_content">
                        <div className="div_info_value">
                            <label>Adresse</label>
                            <input disabled={true} value={devisData.adresse}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Code Postal</label>
                            <input disabled={true} value={devisData.codePostal}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Ville</label>
                            <input disabled={true} value={devisData.ville}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Pays</label>
                            <input disabled={true} value={devisData.pays}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Type de logement</label>
                            <input disabled={true} value={typeBienString[devisData.typeBien]}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Type de location</label>
                            <input disabled={true} value={typeLocationString[devisData.typeLocation]}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Nombre de chambres</label>
                            <input disabled={true} value={devisData.nbChambres}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Capacité</label>
                            <input disabled={true} value={devisData.capacite}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Surface (en m²)</label>
                            <input disabled={true} value={devisData.surface}></input>
                        </div>
                        <div className="div_info_value">
                            <label>Prix de la nuit (en €)</label>
                            <input disabled={true} value={devisData.prixNuit.toFixed(2)}></input>
                        </div>
                    </div>
                </div>
                <span className="span"></span>
                <div className="div_devis_bloc">
                    <label className="little_title">Frais obligatoire</label>
                    <label className="label">Abonnement annuel : 100 €</label>
                    <label className="label">Montant prélevé par nuit : {(devisData.prixNuit * 0.2).toFixed(2)} €</label>
                    {devisData.services.length > 0 && (<label className="little_title">Frais de service par réservation</label>)}
                    {devisData.services.map((service) => (
                        <label key={service.id} className="label"> - {service.nom} : {service.prix} €</label>
                    ))}
                    <br/>
                    <label className="label_color"><b>Montant total TTC </b> : {total.toFixed(2)} €</label>
                    <br/>
                    <div>
                        {!user.user && (<label className="label_info_simple">Vous pouvez vous s'incrire ou vous connecter afin d'ajouter votre logement</label>)}
                        <div className="div_flex_row">
                            {!user.user && (<div>
                                <button className="button" onClick={handleSignUp}>S'inscrire</button>
                                <button className="button" onClick={handleLogin}>Se connecter</button>
                            </div>)}
                            {user.user && (<button className="button" onClick={handleCreateLogement}>Ajouter mon logement</button>)}
                            <button className="button" onClick={onUpdate}>Modifier</button>
                            {isVisibleButtonMail && (<button className="button" type="button" onClick={() => handleClickSendMail()}>Envoyer par mail</button>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}