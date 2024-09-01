import { useState, useEffect } from "react"
import { useUserContext } from "../../main"
import { createService, deleteService, getListService, updateService } from "../../request/requestService"
import { Service, ServiceCreate, spaceColors, typeServiceString } from "../../types/types"
import { ListeServices } from "../Logement/ListeServices"
import { PopupAddService } from "./PopupAddService"

interface ListeServicesProps {
    onClick: (service: Service) => void
}

export function ListeServicesDisponible({onClick}: ListeServicesProps) {
    const [services, setServices] = useState<Service[]>([])
    const [serviceUpdated, setServiceUpdated] = useState<Service>()
    const [isOpen, setIsOpen] = useState(false)
    const user = useUserContext()
    
    useEffect(() => {
        const fetchListServices = async () => {
            if(user.user) {
                if(user.user.role.isAdmin) {
                    const listServices = (await getListService()).services
                    if(listServices) {
                        setServices(listServices)
                    }
                } else if(user.user.role.isOwner) {
                    const listServices = (await getListService("owner")).services
                    if(listServices) {
                        setServices(listServices)
                    }
                } else {
                    const listServices = (await getListService("traveler")).services
                    if(listServices) {
                        setServices(listServices)
                    }
                }
            } 
        }

        fetchListServices()
        
    }, [user.user])

    const handleAdd = async (serviceCreateData: ServiceCreate) => {
        const serviceCreated = await createService(serviceCreateData)
        if(serviceCreated) {
            setServices([...services,serviceCreated])
            setIsOpen(false)
        }
    }

    const handleClickUpdateService = (service: Service) => {
        setServiceUpdated(service)
        setIsOpen(true)
    }

    const handleUpdateService = async (serviceUpdated: Service) => {
        const serviceUpdate = await updateService(serviceUpdated)
        if(serviceUpdate) {
            setServices(services.map((service) => service.id === serviceUpdated.id ? serviceUpdated : service))
            setIsOpen(false)
        }
    }

    const handleDeleteService = async (serviceDeleted: Service) => {
        const serviceDelete = await deleteService(serviceDeleted.id)
        if(serviceDelete) {
            setServices(services.filter((service) => service.id !== serviceDeleted.id))
        }
    }

    return (
        <div className="div_detail">
            <div className="div_liste">
                <label className="title">Liste des services disponibles</label>
                {user.user?.role.isAdmin && (<div className="div_img_button" onClick={() => setIsOpen(true)}>
                    <img src="/icone/add.png"></img> 
                    <label>Ajouter un service</label>
                </div>)}
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info">Nom</label>
                    </div>
                    {user.user?.role.isAdmin && (<div>
                        <label className="label_info">Destiné au</label>
                    </div>)}
                    <div>
                        <label className="label_info">Montant</label>
                    </div>
                    <div>
                        <label className="label_info">Note</label>
                    </div>
                    {user.user?.role.isAdmin && (<div>
                        <label className="label_info">Actions</label>
                    </div>)}
                </div>
            {services.map((service) => (
                <div key={service.id} className="div_row div_row_clickable" style={{justifyContent: "space-between"}} onClick={() => onClick(service)}>
                    <div>
                        <label className="label_info_classic">{service.nom}</label>
                    </div>
                    {user.user?.role.isAdmin && (<div>
                        <label className="label_info_classic">{typeServiceString[service.type]}</label>
                    </div>)}
                    <div>
                        <label className="label_info_classic">{service.prix} €</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{service.notes.length > 0 ? 
                            (service.notes.reduce((acc,note) => (+acc + +note.numero),0) / service.notes.length).toFixed(2) + " /5 (" + service.notes.length + ")"
                            : "Aucune note"}
                        </label>
                    </div>
                    {user.user?.role.isAdmin && (<div>
                        <img src="/icone/crayon.png" className="little_icone_clickable" onClick={() => handleClickUpdateService(service)}/>
                        <button className="button_delete" onClick={() => handleDeleteService(service)}>X</button>
                    </div>)}
                </div>))}
            </div>
            {isOpen && (<PopupAddService isOpen={isOpen} onClose={() => setIsOpen(false)} onAdd={(serviceCreated) => handleAdd(serviceCreated)} serviceUpdate={serviceUpdated} onUpdate={(service) => handleUpdateService(service)}/>)}
        </div>
    )
}