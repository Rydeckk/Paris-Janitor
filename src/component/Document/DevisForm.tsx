import { FormEvent, useEffect, useState } from "react"
import { getListPays } from "../../request/requestPays"
import { country, DevisData, Service, TypeBien, TypeLocation } from "../../types/types"
import { ListeServices } from "../Logement/ListeServices"
import { AddServiceLogement } from "../Logement/AddServiceLogement"
import { useUserContext } from "../../main"

interface DevisFormProps {
    onSubmit: (devisData: DevisData) => void
    devisData?: DevisData
}

export function DevisForm({onSubmit, devisData}: DevisFormProps) {
    const [listPays, setListPays] = useState<country[]>([])
    const [adresse, setAdresse] = useState<string>("")
    const [codePostal, setCodePostal] = useState<string>("")
    const [ville, setVille] = useState<string>("")
    const [pays, setPays] = useState<string>("France")
    const [typeBien, setTypeBien] = useState<TypeBien>("maison")
    const [typeLocation, setTypeLocation] = useState<TypeLocation>("entier")
    const [nbChambres, setNbChambres] = useState<number>(0)
    const [capacite, setCapacite] = useState<number>(1)
    const [surface, setSurface] = useState<number>(9)
    const [prixNuit, setPrixNuit] = useState<number>(0)
    const [nom, setNom] = useState<string>("")
    const [prenom, setPrenom] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [tel, setTel] = useState<string>("")
    const [services, setServices] = useState<Service[]>([])
    const [isFormService, setIsFormService] = useState<boolean>(false)
    const user = useUserContext()

    useEffect(() => {
        const fetchListPays = async () => {
            setListPays((await getListPays()).pays)
        }

        fetchListPays()
    }, [])

    useEffect(() =>{
        if(devisData) {
            setAdresse(devisData.adresse)
            setCodePostal(devisData.codePostal)
            setVille(devisData.ville)
            setPays(devisData.pays)
            setTypeBien(devisData.typeBien)
            setTypeLocation(devisData.typeLocation)
            setNbChambres(devisData.nbChambres)
            setCapacite(devisData.capacite)
            setSurface(devisData.surface)
            setPrixNuit(devisData.prixNuit)
            setNom(devisData.nom)
            setPrenom(devisData.prenom)
            setEmail(devisData.email)
            setTel(devisData.tel)
            setServices(devisData.services)
        }

        if(user.user) {
            setNom(user.user.lastName)
            setPrenom(user.user.firstName)
            setEmail(user.user.email)
            setTel(user.user.phone)
        }
    }, [devisData, user.user])

    const handleClickAdd = () => {
        setIsFormService(true)
    }

    const handleDelete = (serviceDeleted: Service) => {
        setServices(services.filter((service) => service.id !== serviceDeleted.id))
    }

    const handleAddService = (serviceAdded: Service) => {
        setServices([...services,serviceAdded])
        setIsFormService(false)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit({
            adresse: adresse,
            codePostal: codePostal,
            ville: ville,
            pays: pays,
            typeBien: typeBien,
            typeLocation: typeLocation,
            nbChambres: nbChambres,
            capacite: capacite,
            surface: surface,
            prixNuit: prixNuit,
            nom: nom,
            prenom: prenom,
            email: email,
            tel: tel,
            services: services,
            total: 0
        })

    }

    return (
        <div className="div_devis">
            <form className="div_devis_content" onSubmit={handleSubmit}>
                <label className="title">Je fais une demande de simulation personnalisée</label>
                <div className="div_localisation">
                    <div>
                        <div className="div_form" style={{marginRight: "80px"}}>
                            <label>Adresse de votre logement <label className="label_required">(Obligatoire)</label></label>
                            <input value={adresse} onChange={(e) => setAdresse(e.target.value)} required></input>
                        </div>
                        <div className="div_form">
                            <label>Code postal de votre logement <label className="label_required">(Obligatoire)</label></label>
                            <input minLength={5} maxLength={5} value={codePostal} onChange={(e) => setCodePostal(e.target.value)} required></input>
                        </div>
                    </div>
                    <div className="div_form">
                        <label>Ville de votre logement <label className="label_required">(Obligatoire)</label></label>
                        <input value={ville} onChange={(e) => setVille(e.target.value)} required />
                    </div>
                    <div className="div_form">
                        <label>Pays de votre logement <label className="label_required">(Obligatoire)</label></label>
                        <select value={pays} onChange={(e) => setPays(e.target.value)} required>
                            {listPays.map((country) => (
                                <option key={country.id} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="div_devis_champs">
                    <div className="div_form" style={{marginRight: "80px"}}>
                        <label>Type de bien <label className="label_required">(Obligatoire)</label></label>
                        <select value={typeBien} onChange={(e) => setTypeBien(e.target.value as TypeBien)} required>
                            <option value={"maison"}>Maison</option>
                            <option value={"appartement"}>Appartement</option>
                        </select>
                    </div>
                    <div className="div_form">
                        <label>Type de Location <label className="label_required">(Obligatoire)</label></label>
                        <select value={typeLocation} onChange={(e) => setTypeLocation(e.target.value as TypeLocation)} required>
                            <option value={"partiel"}>Logement partiel</option>
                            <option value={"entier"}>Logement complet</option>
                        </select>
                    </div>
                </div>
                <div className="div_form div_devis_champs">
                    <label>Nombre de chambres <label className="label_required">(Obligatoire)</label></label>
                    <input min={0} value={nbChambres} onChange={(e) => setNbChambres(+e.target.value)} required></input>
                </div>
                <div className="div_form div_devis_champs">
                    <label>Quelle est la capacité d'accueil de votre logement ? <label className="label_required">(Obligatoire)</label></label>
                    <input min={1} value={capacite} onChange={(e) => setCapacite(+e.target.value)} required></input>
                </div>
                <div className="div_devis_champs">
                    <div className="div_form" style={{marginRight: "80px"}}>
                        <label>Surface (en m²) <label className="label_required">(Obligatoire)</label></label>
                        <input min={9} value={surface} onChange={(e) => setSurface(+e.target.value)} required></input>
                    </div>
                    <div className="div_form">
                        <label>Prix par nuit (en €) <label className="label_required">(Obligatoire)</label></label>
                        <input min={9} value={prixNuit} onChange={(e) => setPrixNuit(+e.target.value)} required></input>
                    </div>
                </div>
                
                <div className="div_devis_champs">
                    <div className="div_form" style={{marginRight: "80px"}}>
                        <label>Nom <label className="label_required">(Obligatoire)</label></label>
                        <input value={nom} onChange={(e) => setNom(e.target.value)} required></input>
                    </div>
                    <div className="div_form">
                        <label>Prénom  <label className="label_required">(Obligatoire)</label></label>
                        <input value={prenom} onChange={(e) => setPrenom(e.target.value)} required></input>
                    </div>
                </div>
                
                <div className="div_devis_champs">
                    <div className="div_form" style={{marginRight: "80px"}}>
                        <label>Email <label className="label_required">(Obligatoire)</label></label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required></input>
                    </div>
                    <div className="div_form">
                        <label>Téléphone <label className="label_required">(Obligatoire)</label></label>
                        <input value={tel} onChange={(e) => setTel(e.target.value)} type="tel" required></input>
                    </div>
                </div>

                <span className="span"></span>

                <div style={isFormService ? {width: "100%", marginBottom: "35px"} : {width: "100%", marginBottom: "35px", padding: "5px 15px"}}>
                    {!isFormService && (<ListeServices services={services} onClickAdd={() => handleClickAdd()} onDelete={(serviceDeleted) => handleDelete(serviceDeleted)}/>)}
                    {isFormService && (<AddServiceLogement servicesActif={services} onAdd={(serviceAdded) => handleAddService(serviceAdded)} space="owner"/>)}

                    {isFormService && (<div className="div_return">
                        <img src="/icone/return.png"></img>
                        <label onClick={() => setIsFormService(false)}>Services sélectionnés</label>
                    </div>)}
                </div>

                <div style={{width: "100%"}}>
                    <button className="button">Recevoir mon devis</button>
                </div>
            </form>
        </div>
    )
}