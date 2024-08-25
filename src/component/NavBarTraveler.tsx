import { NavLink } from "react-router-dom";
import { useUserContext } from "../main";

export function NavBarTraveler() {
    const user = useUserContext()

    return (
        <div className="navbar">
            <div>
                {user.user && (<NavLink to={"logement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Logements</NavLink>)}
                {user.user && (<NavLink to={"reservation"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Mes réservations</NavLink>)}
            </div>
            <div>
                {!user.user && (<NavLink to={"login"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Se connecter</NavLink>)}
                {!user.user && (<NavLink to={"signup"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>S'inscrire</NavLink>)}
                {!user.user && (<NavLink to={"/owner"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Espace Bailleur</NavLink>)}
            </div>
        </div>
    )
}