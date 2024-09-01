import { useState } from "react";
import { Logement, Service, TypeSpace } from "../../types/types";
import { ListeServices } from "./ListeServices";
import { AddServiceLogement } from "./AddServiceLogement";
import { addServiceLogement, removeServiceLogement } from "../../request/requestLogement";
import { useNavigate } from "react-router-dom";

interface LogementServiceProps {
    logement: Logement
    onUpdate: (logement: Logement) => void
    onReturn: () => void
    space: TypeSpace
}

export function LogementService({logement, onUpdate, onReturn, space}: LogementServiceProps) {
    const [services, setServices] = useState<Service[]>(logement.services)
    const [isFormService, setIsFormService] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleClickAddService = () => {
        setIsFormService(true)
    }

    const handleUpdateLogement = async (serviceAdded: Service) => {
        const logementUpdate = await addServiceLogement(logement.id, serviceAdded.id)
        if(logementUpdate) {
            onUpdate(logementUpdate)
            setServices(logementUpdate.services)
            setIsFormService(false)
        }
    }

    const handleDelete = async (serviceDeleted: Service) => {
        const ok = confirm("Etes-vous sûr de vouloir enlever ce service de votre logement ?")
        if(ok) {
            const logementUpdated = await removeServiceLogement(logement.id, serviceDeleted.id)
            setServices(services.filter((service) => service.id !== serviceDeleted.id))
            if(logementUpdated) onUpdate(logementUpdated)
        }
    }

    return (
        <div>
            <div className="div_detail">
                <label className="title">Mes Services</label>
                <div className="div_logement_info">
                    {!isFormService && (<ListeServices services={services} onClickAdd={handleClickAddService} onDelete={(service) => handleDelete(service)}/>)}
                    {isFormService && (<AddServiceLogement servicesActif={services} onAdd={(serviceAdded) => handleUpdateLogement(serviceAdded)} space={space}/>)}
                </div>
                {isFormService && (<div className="div_return">
                    <img src="/icone/return.png"></img>
                    <label onClick={() => setIsFormService(false)}>Retour à la liste</label>
            </div>)}
            </div>
            {!isFormService && (<div className="div_return">
                <img src="/icone/return.png"></img>
                <label onClick={() => onReturn()}>Retour à la liste</label>
            </div>)}
        </div>
        
    )
}