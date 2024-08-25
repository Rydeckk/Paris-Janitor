import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBarAdmin } from "../component/NavBarAdmin";
import { useUserContext } from "../main";
import { spaceColors, TypeUser } from "../types/types";
import { getTypeUser } from "../utils/utils-function";

export function Master() {
    const [typeCompte, setTypeCompte] = useState<TypeUser>("admin")
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if(user.user) {
            setTypeCompte(getTypeUser(user.user))
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
        </div>
    )
}