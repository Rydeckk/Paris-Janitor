import { NavLink } from "react-router-dom"
import { useUserContext } from "../../main"

export function NavBarAbonnement() {
    const user = useUserContext()

    return (
        <div className="navbar_white">
            <div>
                <NavLink to={""} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Mon abonnement</NavLink>
                <NavLink to={"historique"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Historique</NavLink>
            </div>
        </div>
    )
}