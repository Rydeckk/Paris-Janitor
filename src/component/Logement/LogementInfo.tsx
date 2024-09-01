import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useUserContext } from "../../main";
import { uploadPhoto, deletePhoto } from "../../request/requestPhoto";
import { Logement, Photo, StatutLogement, statutLogementString, TypeBien, typeBienString, TypeLocation, typeLocationString } from "../../types/types";
import { PopupAddPhoto } from "./PopupAddPhoto";
import { getLogement, updateLogement, updateStatutLogement } from "../../request/requestLogement";
import { useLocation } from "react-router-dom";

interface LogementInfoProps {
    logement: Logement
    onUpdate: (logement: Logement) => void
    onReturn: () => void
}

export function LogementInfo({logement, onUpdate, onReturn}: LogementInfoProps) {
    const [listPhoto, setListPhoto] = useState<Array<Photo>>(logement.photos)
    const [photoSrcMain, setPhotoSrcMain] = useState<string>("/icone/image.png")
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEdition, setIsEdition] = useState<boolean>(false)
    const [nom, setNom] = useState<string>(logement.nom)
    const [typeLocation, setTypeLocation] = useState<TypeLocation>(logement.typeLocation)
    const [nbChambres, setNbChambres] = useState<number>(logement.nbChambres)
    const [capacite, setCapacite] = useState<number>(logement.capacite)
    const [surface, setSurface] = useState<number>(logement.surface)
    const [prixNuit, setPrixNuit] = useState<number>(logement.prixNuit)
    const user = useUserContext()
    const location = useLocation()

    useEffect(() => {
        if(listPhoto.length > 0) {
            setPhotoSrcMain(import.meta.env.VITE_URL_API+listPhoto[0].path)
        }
    }, [logement])

    const handleAddPhoto = async (photo: File) => {
        const photoCreated = await uploadPhoto(logement.id, photo)
        if(photoCreated) {
            setListPhoto([...listPhoto,photoCreated])
            setPhotoSrcMain(import.meta.env.VITE_URL_API+photoCreated.path)

            const logementFound = await getLogement(logement.id)
            if(logementFound) {
                onUpdate(logementFound)
            }
        } 
    }

    const handleDelete = async (photoDelete: Photo) => {
        await deletePhoto(photoDelete.id, logement.id)
        setListPhoto(listPhoto.filter((photo) => photo.id !== photoDelete.id))
        const logementFound = await getLogement(logement.id)
        if(logementFound) {
            onUpdate(logementFound)
        }
        
        if(photoSrcMain === import.meta.env.VITE_URL_API+photoDelete.path) {
            if(listPhoto.filter((photo) => photo.id !== photoDelete.id).length === 0) {
                setPhotoSrcMain("/icone/image.png")
            } else {
                setPhotoSrcMain(import.meta.env.VITE_URL_API+listPhoto.filter((photo) => photo.id !== photoDelete.id)[0].path)
            }
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const logementUpdated = await updateLogement(logement.id,{
            nom: nom,
            typeLocation: typeLocation,
            nbChambres: nbChambres,
            surface: surface,
            prixNuit: prixNuit,
            capacite: capacite
        })
        if(logementUpdated) {
            onUpdate(logementUpdated)
        }
        setIsEdition(false)
    }

    const handleUpdateStatut = async (statut: StatutLogement) => {
        const logementUpdated = await updateStatutLogement(logement.id,statut)
        if(logementUpdated) {
            onUpdate({...logement,statut: logementUpdated.statut})
        }
    }

    return (
        <div>
            <form className="div_detail" onSubmit={(e) => handleSubmit(e)}>
                <div className="div_content_logement_detail">
                    <div>
                        <div className="div_img_principal">
                            <img src={photoSrcMain}></img>
                        </div> 
                        <div className="div_list_img_petite">
                            {listPhoto.map((photo) => (
                                <div key={photo.id}>
                                    <img src={import.meta.env.VITE_URL_API+photo.path} onClick={() => setPhotoSrcMain(import.meta.env.VITE_URL_API+photo.path)}></img>
                                    {isEdition && (<button type="button" onClick={() => handleDelete(photo)}>x</button>)}
                                </div>
                            ))}
                            {listPhoto.length < 5 && isEdition && (<div>
                                <img src="/icone/add.png" onClick={() => setIsPopupOpen(true)}></img>
                            </div>)}
                            
                        </div>
                    </div>
                    <div className="div_logement_info" >
                        <div className="div_logement_info_content">
                            <div className="div_info_value">
                                <label>Nom</label>
                                <input disabled={!isEdition} value={nom} onChange={(e) => setNom(e.target.value)} required></input>
                            </div>
                            <div className="div_info_value">
                                <label>Adresse</label>
                                <input disabled={true} value={logement.adresse}></input>
                            </div>
                            <div className="div_info_value">
                                <label>Code Postal</label>
                                <input disabled={true} value={logement.codePostal}></input>
                            </div>
                            <div className="div_info_value">
                                <label>Ville</label>
                                <input disabled={true} value={logement.ville}></input>
                            </div>
                            <div className="div_info_value">
                                <label>Pays</label>
                                <input disabled={true} value={logement.pays}></input>
                            </div>
                            <div className="div_info_value">
                                <label>Type de logement</label>
                                <input disabled={true} value={typeBienString[logement.typeLogement]}></input>
                            </div>
                            <div className="div_info_value">
                                <label>Type de location</label>
                                <select disabled={!isEdition} value={typeLocation} onChange={(e) => setTypeLocation(e.target.value as TypeLocation)}>
                                    <option key={0} value={"entier"}>{typeLocationString["entier"]}</option>
                                    <option key={1} value={"partiel"}>{typeLocationString["partiel"]}</option>
                                </select>
                            </div>
                            <div className="div_info_value">
                                <label>Nombre de chambres</label>
                                <input disabled={!isEdition} value={nbChambres} onChange={(e) => setNbChambres(+e.target.value)} required></input>
                            </div>
                            <div className="div_info_value">
                                <label>Capacité</label>
                                <input disabled={!isEdition} value={capacite} onChange={(e) => setCapacite(+e.target.value)} required></input>
                            </div>
                            <div className="div_info_value">
                                <label>Surface (en m²)</label>
                                <input disabled={!isEdition} value={surface} onChange={(e) => setSurface(+e.target.value)} required></input>
                            </div>
                            <div className="div_info_value">
                                <label>Prix de la nuit (en €)</label>
                                <input disabled={!isEdition} value={prixNuit} onChange={(e) => setPrixNuit(+e.target.value)} required></input>
                            </div>
                            {user.user?.role.isOwner && (<div className="div_info_value">
                                <label>Statut</label>
                                <input disabled={true} value={logement.isActif ? statutLogementString[logement.statut] : "Inactif"}></input>
                            </div>)}
                        </div>
                    </div>
                </div>
                {user.user?.role.isOwner && (<div className="div_button_info_logement">
                    {!isEdition && !user.user.role.isAdmin && (<button type="button" className="button" onClick={() => setIsEdition(true)}>Modifier</button>)}
                    {(isEdition || user.user.role.isAdmin) && (<button type="button" className="button_suppr" onClick={() => setIsEdition(false)}>Supprimer</button>)}
                    {isEdition && (<button type="submit" className="button">Enregistrer</button>)}
                    {user.user.role.isAdmin && logement.statut === "attenteValidation" && (<button type="button" className="button" onClick={() => handleUpdateStatut("valide")}>Valider</button>)}
                    {user.user.role.isAdmin && logement.statut === "attenteValidation" && (<button type="button" className="button" onClick={() => handleUpdateStatut("refuse")}>Refuser</button>)}
                </div>)}
            </form>
            <PopupAddPhoto isOpen={isPopupOpen} onUpload={(photo) => handleAddPhoto(photo)} onClose={() => setIsPopupOpen(false)}/>
            <div className="div_return">
                <img src="/icone/return.png"></img>
                <label onClick={() => onReturn()}>Retour à la liste</label>
            </div>
        </div>
        
    )
}