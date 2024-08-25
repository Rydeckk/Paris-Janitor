import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { NavBarOwner } from "../component/NavBarOwner";
import { useUserContext } from "../main";
import { spaceColors, TypeUser } from "../types/types";
import { getTypeUser } from "../utils/utils-function";
import { HomeOwner } from "./HomeOwner";
import { ListeLogements } from "../component/ListeLogements";
import { Devis } from "./Devis";
import { Login } from "../component/Login";
import { SignUp } from "../component/SignUp";
import { ListeDevis } from "../component/ListeDevis";
import { Document } from "../component/Document";

export function Owner() {
    const [typeCompte, setTypeCompte] = useState<TypeUser>("owner")
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
        } else if (typeCompte === "traveler") {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["traveler"])
            navigate("/")
        } else {
            document.documentElement.style.setProperty('--couleur-principale', spaceColors["owner"])
        }
    }, [typeCompte])
    
    return (
        <div>
            <NavBarOwner />
            <Routes>
                <Route path={"/"} element={<HomeOwner />} />
                <Route path={"/logement/*"} element={<ListeLogements />} />
                <Route path={"/document/*"} element={<Document />}/>
                <Route path={"/devis"} element={<Devis />} />
                <Route path={"/login"} element={<Login from="owner"/>} />
                <Route path={"/signup"} element={<SignUp from="owner" />} />
            </Routes>
        </div>
    )
}