import { useEffect } from "react";
import { NavBarOwner } from "../component/NavbarHome/NavBarOwner";
import { useUserContext } from "../main";
import { useNavigate } from "react-router-dom";

export function HomeOwner() {
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if(user.user) {
            navigate("logement")
        }
    },[user.user])

    return (
        <div className="div_welcome">
            <div>
                <label>Commencez dès maintenant simplement en demandant un devis !</label>
            </div>
        </div>
    )
}