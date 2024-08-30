import { Route, Routes } from "react-router-dom"
import { MonAbonnement } from "./MonAbonnement"
import { NavBarAbonnement } from "./NavBarAbonnement"
import { ListeAbonnement } from "./ListeAbonnement"

export function Abonnement() {
    return (
        <div>
            <NavBarAbonnement />
            <Routes>
                <Route path="/" element={<MonAbonnement />}/>
                <Route path="/historique" element={<ListeAbonnement />}/>
            </Routes>
        </div>
    )
}