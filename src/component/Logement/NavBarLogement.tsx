import { NavLink, useLocation } from "react-router-dom";
import { Logement } from "../../types/types";
import { useUserContext } from "../../main";
import { useEffect, useState } from "react";

export function NavBarLogement() {
    const [datesReservation, setDatesReservation] = useState<Date[]>([])
    const user = useUserContext()
    const location = useLocation()

    useEffect(() => {
        if(location.pathname === "/logement/reservation") {
            try {
                setDatesReservation(location.state.dates)
            } catch (error) {
                setDatesReservation([])
            }
        } else {
            setDatesReservation([])
        }
    }, [location.pathname])
    
    return (
        <div className="navbar_white">
            <div>
                <NavLink to={""} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Informations</NavLink>
                <NavLink to={"calendrier"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Calendrier</NavLink>
                {user.user?.role.isOwner && (<NavLink to={"service"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Service</NavLink>)}
                {user.user?.role.isOwner && (<NavLink to={"equipement"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Equipements</NavLink>)}
                {user.user?.role.isOwner && (<NavLink to={"historique"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Historique</NavLink>)}
                {!user.user?.role.isOwner && datesReservation.length > 0 && (<NavLink to={"reservation"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Réservation</NavLink>)}
            </div>
        </div>
    )
}