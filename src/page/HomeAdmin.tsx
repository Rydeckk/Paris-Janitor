import { useEffect } from "react";
import { useUserContext } from "../main";
import { useNavigate } from "react-router-dom";

export function HomeAdmin() {
    const user = useUserContext()
    const navigate = useNavigate()

    return (
        <div className="div_welcome">
            <div>
                <label>Bienvenue sur l'espace administrateur !</label>
            </div>
        </div>
    )
}