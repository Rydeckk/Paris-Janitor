import { NavLink } from "react-router-dom";

export function NavBarTraveler() {
    return (
        <div className="navbar">
            <div>

            </div>
            <div>
                <NavLink to={"login"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Se connecter</NavLink>
                <NavLink to={"signup"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>S'inscrire</NavLink>
                <NavLink to={"/owner"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Espace Bailleur</NavLink>
            </div>
        </div>
    )
}