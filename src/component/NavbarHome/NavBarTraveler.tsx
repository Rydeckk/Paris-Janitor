import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../main";
import { logout } from "../../request/requestAuth";

export function NavBarTraveler() {
    const user = useUserContext()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        user.setUser(null)
        navigate("/")
    }

    return (
        <div className="navbar">
            <div>
                {user.user && (<NavLink to={"logement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Logements</NavLink>)}
                {user.user && (<NavLink to={"service"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Services</NavLink>)}
                {user.user && (<NavLink to={"reservation"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Mes réservations</NavLink>)}
            </div>
            <div>
                {!user.user && (<NavLink to={"login"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Se connecter</NavLink>)}
                {!user.user && (<NavLink to={"signup"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>S'inscrire</NavLink>)}
                {!user.user && (<NavLink to={"/owner"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Espace Bailleur</NavLink>)}
                {user.user && (<img src="/icone/logoutWhite.png" className="icone_clickable" onClick={() => handleLogout()} style={{marginLeft: "10px", marginBottom: "1%"}}></img>)}
            </div>
        </div>
    )
}