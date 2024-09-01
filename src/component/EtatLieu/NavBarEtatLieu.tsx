import { NavLink } from "react-router-dom";

export function NavBarEtatLieu() {
    return (
        <div className="navbar_white">
            <div>
                <NavLink to={""} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Etats des lieux</NavLink>
                <NavLink to={"afaireEntree"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Etats des lieux d'entrée</NavLink>
                <NavLink to={"afaireSortie"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Etats des lieux de sortie</NavLink>
            </div>
        </div>
    )
}