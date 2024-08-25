import { NavLink } from "react-router-dom"
import { useUserContext } from "../main"

export function NavBarDocument() {
    const user = useUserContext()
    
    return (
        <div className="navbar_white">
            <div>
                <NavLink to={""} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Devis</NavLink>
                <NavLink to={"facture"} className={({ isActive }) => (isActive ? "navlink_inverse navlink_inverse_active" : "navlink_inverse")} end>Factures</NavLink>
            </div>
        </div>
    )
}