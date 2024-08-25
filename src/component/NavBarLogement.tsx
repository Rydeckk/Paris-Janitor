import { NavLink, useLocation } from "react-router-dom";
import { Logement } from "../types/types";
import { useUserContext } from "../main";

export function NavBarLogement() {
    const user = useUserContext()
    
    return (
        <div className="navbar_white">
            <div>
                <NavLink to={""} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Informations</NavLink>
                <NavLink to={"calendrier"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Calendrier</NavLink>
                {user.user?.role.isOwner && (<NavLink to={"service"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Service</NavLink>)}
                {!user.user?.role.isOwner && (<NavLink to={"reservation"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Réservation</NavLink>)}
            </div>
        </div>
    )
}