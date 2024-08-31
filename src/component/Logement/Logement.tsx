import { Route, Routes } from "react-router-dom";
import { NavBarListeLogement } from "./NavBarListeLogement";
import { ListeLogements } from "./ListeLogements";

export function Logement() {
    return (
        <div>
            <NavBarListeLogement />
            <Routes>
                <Route path="/*" element={<ListeLogements />}/>
                <Route path="/avalider/*" element={<ListeLogements statut="attenteValidation"/>}/>
            </Routes>
        </div>
        
    )
}