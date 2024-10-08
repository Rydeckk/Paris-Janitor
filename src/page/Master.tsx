import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { NavBarAdmin } from "../component/NavbarHome/NavBarAdmin";
import { useUserContext } from "../main";
import { Service, spaceColors, TypeUser } from "../types/types";
import { getTypeUser } from "../utils/utils-function";
import { HomeAdmin } from "./HomeAdmin";
import { ListeServicesDisponible } from "../component/Service/ListeServicesDisponible";
import { ListeLogements } from "../component/Logement/ListeLogements";
import { Login } from "../component/Auth/Login";
import { Utilisateur } from "../component/Utilisateur/Utilisateur";
import { Abonnement } from "../component/Abonnement/Abonnement";
import { Document } from "../component/Document/Document";
import { Logement } from "../component/Logement/Logement";
import { ListeOperation } from "../component/Operation/ListeOperation";
import { NoteService } from "../component/Service/NoteService";
import { EtatLieu } from "../component/EtatLieu/EtatLieu";

export function Master() {
    const [typeCompte, setTypeCompte] = useState<TypeUser>("admin")
    const [service, setService] = useState<Service>()
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if(user.user) {
            setTypeCompte(getTypeUser(user.user))
        } 

        if(!localStorage.getItem("token")) {
            navigate("/master/login")
        }
    }, [user.user])

    useEffect(() => {
        if(typeCompte === "traveler") {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["traveler"])
            navigate("/")
        } else if (typeCompte === "owner") {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["owner"])
            navigate("/owner/logement")
        } else {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["admin"])
        }
    }, [typeCompte])

    const handleClickService = (service: Service) => {
        setService(service)
        navigate("/master/service/note")
    }

    
    return (
        <div>
            <NavBarAdmin />
            <Routes>
                <Route path="/" element={<HomeAdmin />}/>
                <Route path="/logement/*" element={<Logement />} />
                <Route path="/service" element={<ListeServicesDisponible onClick={(service) => handleClickService(service)}/>}/>
                <Route path="/service/note" element={service && (<NoteService service={service}/>)}/>
                <Route path="/user/*" element={<Utilisateur />}/>
                <Route path="/abonnement/*" element={<Abonnement />}/>
                <Route path="/document/*" element={<Document />}/>
                <Route path="/login" element={<Login from="admin" />}/>
                <Route path="/transaction" element={<ListeOperation />}/>
                <Route path="/etatLieu/*" element={<EtatLieu />} />
            </Routes>
        </div>
    )
}