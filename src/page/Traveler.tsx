import React, { useEffect, useState } from "react";
import { ListeLogements } from "../component/Logement/ListeLogements";
import { NavBarTraveler } from "../component/NavbarHome/NavBarTraveler";
import { useUserContext } from "../main";
import { Service, spaceColors, TypeUser } from "../types/types";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getTypeUser } from "../utils/utils-function";
import { Login } from "../component/Auth/Login";
import { SignUp } from "../component/Auth/SignUp";
import { HomeTraveler } from "./HomeTraveler";
import { ListeReservation } from "../component/Logement/ListeReservation";
import { ListeServicesDisponible } from "../component/Service/ListeServicesDisponible";
import { NoteService } from "../component/Service/NoteService";
import { ServiceAddNote } from "../component/Service/ServiceAddNote";

export function Home() {
    const [typeCompte, setTypeCompte] = useState<TypeUser>("traveler")
    const [service, setService] = useState<Service>()
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if(user.user) {
            setTypeCompte(getTypeUser(user.user))
        }
    }, [user.user])

    useEffect(() => {
        if(typeCompte === "admin") {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["admin"])
            navigate("/master")
        } else if (typeCompte === "owner") {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["owner"])
            navigate("/owner/logement")
        } else {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["traveler"])
        } 
        
    }, [typeCompte])

    const handleClickService = (service: Service) => {
        setService(service)
        navigate("/service/note")
    }

    return (
        <div>
            <NavBarTraveler />
            <Routes>
                <Route path={"/"} element={<HomeTraveler />} />
                <Route path={"/service"} element={<ListeServicesDisponible onClick={(service) => handleClickService(service)}/>}/>
                <Route path={"/service/note"} element={service && (<NoteService service={service}/>)}/>
                <Route path={"/service/addnote"} element={<ServiceAddNote/>}/>
                <Route path={"/logement/*"} element={<ListeLogements />} />
                <Route path={"/reservation"} element={<ListeReservation />} />
                <Route path={"/login"} element={<Login from="traveler"/>} />
                <Route path={"/signup"} element={<SignUp from="traveler" />} />
            </Routes>
        </div>
    )
}