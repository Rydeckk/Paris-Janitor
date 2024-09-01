import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../main";
import { logout } from "../../request/requestAuth";

export function NavBarOwner() {
    const user = useUserContext()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        user.setUser(null)
        navigate("/owner")
    }

    return (
        <div className="navbar">
            <div>
                {user.user && (<NavLink to={"logement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Mes logements</NavLink>)}
                {user.user && (<NavLink to={"abonnement"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Mon abonnement</NavLink>)}
                {user.user && (<NavLink to={"document"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")}>Mes documents</NavLink>)}
                {user.user && (<NavLink to={"transaction"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Transactions</NavLink>)}
            </div>
            <div>
                <NavLink to={"devis"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Obtenir un devis</NavLink>
                {!user.user && (<NavLink to={"login"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Se connecter</NavLink>)}
                {!user.user && (<NavLink to={"signup"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>S'inscrire</NavLink>)}
                {!user.user && (<NavLink to={"/"} className={({ isActive }) => (isActive ? "navlink link_active" : "navlink")} end>Espace Voyageur</NavLink>)}
                {user.user && (<img src="/icone/logoutWhite.png" className="icone_clickable" onClick={() => handleLogout()} style={{marginLeft: "10px", marginBottom: "1%"}}></img>)}
            </div>
        </div>
    )
}