import { NavLink } from "react-router-dom";
import { useUserContext } from "../main";

export function NavBarOwner() {
    const user = useUserContext()

    return (
        <div className="navbar">
            <div>
                {user.user && (<NavLink to={"logement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Mes logements</NavLink>)}
                {user.user && (<NavLink to={"document"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Mes documents</NavLink>)}
            </div>
            <div>
                <NavLink to={"devis"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Obtenir un devis</NavLink>
                {!user.user && (<NavLink to={"login"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Se connecter</NavLink>)}
                {!user.user && (<NavLink to={"signup"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>S'inscrire</NavLink>)}
                {!user.user && (<NavLink to={"/"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Espace Voyageur</NavLink>)}
            </div>
        </div>
    )
}