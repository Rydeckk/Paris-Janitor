import { NavLink } from "react-router-dom";

export function NavBarListeLogement() {
    return (
        <div className="navbar_white">
            <div>
                <NavLink to={""} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Logements</NavLink>
                <NavLink to={"avalider"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Logements à valider</NavLink>
            </div>
        </div>
    )
}