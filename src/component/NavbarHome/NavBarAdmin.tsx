import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../main";
import { logout } from "../../request/requestAuth";

export function NavBarAdmin() {
    const user = useUserContext()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        user.setUser(null)
        navigate("/master")
    }

    return (
        <div className="navbar">
            <div>
                {user.user && (<NavLink to={"logement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Logements</NavLink>)}
                {user.user && (<NavLink to={"user"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Utilisateurs</NavLink>)}
                {user.user && (<NavLink to={"service"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Services</NavLink>)}
                {user.user && (<NavLink to={"abonnement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Abonnement</NavLink>)}
            </div>
            <div>
                {!user.user && (<NavLink to={"login"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Se connecter</NavLink>)}
                {user.user && (<img src="/icone/logoutWhite.png" className="icone_clickable" onClick={() => handleLogout()} style={{marginLeft: "10px", marginBottom: "1%"}}></img>)}
            </div>
        </div>
    )
}