import { FormEvent, useEffect, useState } from "react"
import { Service } from "../../types/types"
import { useLocation, useNavigate } from "react-router-dom"
import { useUserContext } from "../../main"
import { createNote } from "../../request/requestNote"

export function ServiceAddNote() {
    const [services, setServices] = useState<Service[]>([])
    const [selectedService, setSelectedService] = useState(0)
    const [note, setNote] = useState(1)
    const [titre, setTitre] = useState("")
    const [com, setCom] = useState("")
    const location = useLocation()
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        let services = location.state.services as Service[]
        if(services) {
            services.forEach((service) => {
                let containNote = false
                service.notes.forEach((note) => {
                    if(user.user?.notes.map((note) => note.id).includes(note.id)) {
                        containNote = true
                    }
                })
                
                if(containNote) {
                    services = services.filter((serviceFilter) => serviceFilter.id !== service.id)
                }
            })
        }

        setServices(services)
    }, [user.user])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const serviceFound = services.filter((service) => service.id === selectedService)[0]
        const createdNote = await createNote(serviceFound.id, {titre: titre, numero: note, commentaire: com})
        if(createdNote) {
            setServices(services.filter((service) => service.id !== serviceFound.id))
            setCom("")
            setTitre("")
        }
    }

    return (
        <div>
            <div className="div_detail">
                <form className="div_liste" onSubmit={handleSubmit}>
                    <label className="title">Ajouter une note</label>
                    <div className="div_form">
                        <label>Service</label>
                        <select value={selectedService} onChange={(e) => setSelectedService(+e.target.value)} required>
                            <option value={""}>Selectionner un service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>{service.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="div_form">
                        <label>Note</label>
                        <select value={note} onChange={(e) => setNote(+e.target.value)} required>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                        </select>
                    </div>
                    <div className="div_form">
                        <label>Titre</label>
                        <input value={titre} onChange={(e) => setTitre(e.target.value)} required></input>
                    </div>
                    <div className="div_form">
                        <label>Commentaire</label>
                        <textarea value={com} onChange={(e) => setCom(e.target.value)}></textarea>
                    </div>
                    <button className="button">Ajouter</button>
                </form>
            </div>
            <div className="div_return">
                <img src="/icone/return.png"></img>
                <label onClick={() => navigate("/service")}>Retour à la liste</label>
            </div>
        </div>
    )
}