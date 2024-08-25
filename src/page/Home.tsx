import React, { useEffect, useState } from "react";
import { ListeLogements } from "../component/ListeLogements";
import { NavBarTraveler } from "../component/NavBarTraveler";
import { useUserContext } from "../main";
import { spaceColors, TypeUser } from "../types/types";
import { useNavigate } from "react-router-dom";
import { getTypeUser } from "../utils/utils-function";

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
            <h1 className="title">Bienvenue sur Paris Janitor</h1>
            {user.user && (<div>
                <ListeLogements />
            </div>)}
        </div>
    )
}