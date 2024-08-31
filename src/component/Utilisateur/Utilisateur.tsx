import { Route, Routes } from "react-router-dom";
import { ListeUtilisateur } from "./ListeUtilisateur";
import { ListeUtilisateurBanni } from "./ListeUtilisateurBanni";
import { NavBarUtilisateur } from "./NavBarUtilisateur";
import { HistoriqueBannissement } from "./HistoriqueBannissement";

export function Utilisateur() {
    return (
        <div>
            <NavBarUtilisateur />
            <Routes>
                <Route path="/" element={<ListeUtilisateur />} />
                <Route path="/banni" element={<ListeUtilisateurBanni />} />
                <Route path="/historique" element={<HistoriqueBannissement />}/>
            </Routes>
        </div>
    )
}