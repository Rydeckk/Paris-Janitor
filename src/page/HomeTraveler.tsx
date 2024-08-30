import { useEffect } from "react";
import { useUserContext } from "../main";
import { useNavigate } from "react-router-dom";

export function HomeTraveler() {
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
                <label>Réservez dès maintenant vos services en vous authentifiant !</label>
            </div>
        </div>
    )
}