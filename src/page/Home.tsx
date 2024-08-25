import React, { useEffect, useState } from "react";
import { ListeLogements } from "../component/ListeLogements";
import { NavBarTraveler } from "../component/NavBarTraveler";
import { useUserContext } from "../main";
import { spaceColors, TypeUser } from "../types/types";
import { Route, Routes, useNavigate } from "react-router-dom";
import { getTypeUser } from "../utils/utils-function";
import { Login } from "../component/Login";
import { SignUp } from "../component/SignUp";

export function Home() {
    const [typeCompte, setTypeCompte] = useState<TypeUser>("traveler")
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

    const handleClick = () => {

    }

    return (
        <div>
            <NavBarTraveler />
            <Routes>
                <Route path={"/logement/*"} element={<ListeLogements />} />
                <Route path={"/login"} element={<Login from="traveler"/>} />
                <Route path={"/signup"} element={<SignUp from="traveler" />} />
            </Routes>
        </div>
    )
}