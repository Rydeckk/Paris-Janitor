import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { NavBarAdmin } from "../component/NavbarHome/NavBarAdmin";
import { useUserContext } from "../main";
import { spaceColors, TypeUser } from "../types/types";
import { getTypeUser } from "../utils/utils-function";
import { HomeAdmin } from "./HomeAdmin";
import { ListeServicesDisponible } from "../component/Service/ListeServicesDisponible";
import { ListeLogements } from "../component/Logement/ListeLogements";
import { Login } from "../component/Auth/Login";

export function Master() {
    const [typeCompte, setTypeCompte] = useState<TypeUser>("admin")
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
    
    return (
        <div>
            <NavBarAdmin />
            <Routes>
                <Route path="/" element={<HomeAdmin />}/>
                <Route path="/logement/*" element={<ListeLogements />} />
                <Route path="/service/*" element={<ListeServicesDisponible />}/>
                <Route path="/user/*"/>
                <Route path="/abonnement"/>
                <Route path="/login" element={<Login from="admin" />}/>
            </Routes>
        </div>
    )
}