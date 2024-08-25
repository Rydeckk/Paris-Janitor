import { NavLink } from "react-router-dom";

export function NavBarAdmin() {
    return (
        <div className="navbar">
            <NavLink to={"logement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Logements</NavLink>
        </div>
    )
}