import { Route, Routes } from "react-router-dom"
import { MonAbonnement } from "./MonAbonnement"
import { NavBarAbonnement } from "./NavBarAbonnement"
import { ListeAbonnement } from "./ListeAbonnement"
import { useUserContext } from "../../main"
import { AbonnementAdmin } from "./AbonnementAdmin"

export function Abonnement() {
    const user = useUserContext()

    return (
        <div>
            <NavBarAbonnement />
            <Routes>
                <Route path="/" element={user.user?.role.isAdmin ? <AbonnementAdmin /> : <MonAbonnement />}/>
                <Route path="/historique" element={<ListeAbonnement />}/>
            </Routes>
        </div>
    )
}