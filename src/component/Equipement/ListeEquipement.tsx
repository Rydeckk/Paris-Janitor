import { useEffect, useState } from "react"
import { useUserContext } from "../../main"
import { CreateEquipement, Equipement, EtatEquipString, Logement } from "../../types/types"
import { createEquipement, deleteEquipement, getListEquipement, updateEquipement } from "../../request/requestEquip"
import { PopupAddEquipement } from "./PopupAddEquipement"

interface ListeEquipementProps {
    logement: Logement
    onUpdate: (logement: Logement) => void
    onReturn: () => void
}

export function ListeEquipement({logement, onUpdate, onReturn}: ListeEquipementProps) {
    const [equipements, setEquipements] = useState<Equipement[]>([])
    const [equipSelected, setEquipSelected] = useState<Equipement>()
    const [isOpen, setIsOpen] = useState(false)
    const user = useUserContext()

    useEffect(() => {
        const fetchListEquip = async () => {
            const listEquip = (await getListEquipement(logement.id)).equipements
            if(listEquip) {
                setEquipements(listEquip)
            }
        }

        fetchListEquip()
    }, [logement])

    const handleDelete = async (equiDeleted: Equipement) => {
        const ok = confirm("Etes-vous sûr de vouloir enlever ce service de votre logement ?")
        if(ok) {
            const equipementDeleted = await deleteEquipement(equiDeleted, logement.id)
            if(equipementDeleted) {
                const newListEquip = equipements.filter((equipement) => equipement.id !== equiDeleted.id)
                setEquipements(newListEquip)
                const logementUpdate = {...logement, equipements: newListEquip}
                onUpdate(logementUpdate)
            }
        }
    }

    const handleAddEquip = async (equip: CreateEquipement) => {
        const equipCreated = await createEquipement(logement.id, equip)
        if(equipCreated) {
            const newListEquip = [...equipements, equipCreated]
            setEquipements(newListEquip)
            const logementUpdate = {...logement, equipements: newListEquip}
            onUpdate(logementUpdate)
            setIsOpen(false)
        }
    }

    const handleclickUpdateEquip = (equip: Equipement) => {
        setEquipSelected(equip)
        setIsOpen(true)
    }

    const handleUpdateEquip = async (equipUpdated: Equipement) => {
        const equipementUpdated= await updateEquipement(equipUpdated, logement.id)
        if(equipementUpdated) {
            const newListEquip = equipements.map((equip) => equip.id === equipementUpdated.id ? equipementUpdated : equip)
            setEquipements(newListEquip)
            const logementUpdate = {...logement, equipements: newListEquip}
            onUpdate(logementUpdate)
            setIsOpen(false)
            setEquipSelected(undefined)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        setEquipSelected(undefined)
    }

    return (
        <div className="div_detail">
            <div className="div_liste">
                <label className="title">Liste des équipements disponibles</label>
                {user.user?.role.isOwner && (<div className="div_img_button" onClick={() => setIsOpen(true)}>
                    <img src="/icone/add.png"></img> 
                    <label>Ajouter un équipement</label>
                </div>)}
                
                {equipements && equipements.length > 0 ? equipements.map((equipement) => (
                    <div key={equipement.id} className="div_row">
                        {user.user?.role.isOwner && (<button className="button_delete" onClick={() => handleDelete(equipement)}>X</button>)}
                        {user.user?.role.isOwner && (<img src="/icone/crayon.png" className="little_icone_clickable" onClick={() => handleclickUpdateEquip(equipement)}/>)}
                        <label className="label_info" style={{color: "black"}}>{equipement.nom}</label>
                        {user.user?.role.isOwner && (<label className="label_info" style={{fontWeight: "bold", color: "black"}}>{EtatEquipString[equipement.etat]}</label>)}
                    </div>   
                )): (
                    <label>Aucun equipement pour ce logement</label>
                )}
            </div>
            {isOpen && (<PopupAddEquipement isOpen={isOpen} onClose={() => handleClose()} onAdd={(equip) => handleAddEquip(equip)} equipUpdate={equipSelected} onUpdate={(equip) => handleUpdateEquip(equip)}/>)}
        </div>
        
    )
}