import { NavLink, useLocation } from "react-router-dom";
import { useUserContext } from "../../main";
import { useEffect, useState } from "react";

export function NavBarUtilisateur() {
    const user = useUserContext()
    const location = useLocation()

    return (
        <div className="navbar_white">
            <div>
                <NavLink to={""} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Utilisateurs</NavLink>
                <NavLink to={"banni"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Bannis</NavLink>
                <NavLink to={"historique"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Historique</NavLink>
            </div>
        </div>
    )
}