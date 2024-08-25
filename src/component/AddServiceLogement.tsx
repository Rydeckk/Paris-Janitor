import { useEffect, useState } from "react";
import { Logement, Service, TypeSpace } from "../types/types";
import { useUserContext } from "../main";
import { getListService, getListServiceOwner } from "../request/requestService";
import { addServiceLogement } from "../request/requestLogement";

interface AddServiceLogementProps {
    servicesActif: Service[]
    onAdd: (service: Service) => void
    space: TypeSpace
}

export function AddServiceLogement({servicesActif, onAdd, space}: AddServiceLogementProps) {
    const [services, setServices] = useState<Service[]>([])
    const [serviceIdSelected, setServiceIdSelected] = useState<number>()
    const [selectedService, setSelectedService] = useState<Service>()
    const user = useUserContext()

    useEffect(() => {
        const fetchListService = async () => {
            if(user.user) {
                const roleUser = user.user.role
                if(roleUser.isAdmin) {
                    setServices((await getListService()).services)
                } else if (roleUser.isOwner) {
                    setServices((await getListServiceOwner()).services)
                } else {
                    setServices((await getListService("traveler")).services)
                }
            } else {
                if(space === "owner") {
                    setServices((await getListServiceOwner()).services)
                } else {
                    setServices((await getListService("traveler")).services)
                }
            }
        }

        fetchListService()
    }, [])

    useEffect(() => {
        servicesActif.forEach((service) => {
            if(services.find((s) => s.id === service.id)) {
                setServices(services.filter((s) => s.id !== service.id))
            }
        })
    }, [services])

    useEffect(() => {
        const serviceFound = services.find((service) => service.id === serviceIdSelected)
        if(serviceFound) {
            setSelectedService(serviceFound)
        } else {
            setSelectedService(undefined)
        }
        
    }, [serviceIdSelected])

    const handleClickAdd = async () => {
        if(selectedService) {
            setServices(services.filter((s) => selectedService?.id !== s.id))
            onAdd(selectedService)
        }
    }

    return (
        <div className="div_liste">
            <select value={serviceIdSelected} onChange={(e) => setServiceIdSelected(+e.target.value)} className="select" style={{margin: "10px"}}>
                <option>Sélectionner un service</option>
                {services.map((service) => (
                    <option key={service.id} value={service.id}>{service.nom}</option>
                ))}
            </select>
            {selectedService && (<label className="label_info"><b>Prix à payer : </b>{selectedService.prix} €</label>)}
            <button className="button" disabled={!selectedService} onClick={handleClickAdd}>Ajouter Service</button>
        </div>
    )
}