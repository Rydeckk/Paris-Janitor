import { Route, Routes } from "react-router-dom";
import { Logement } from "../../types/types";
import { ListeEtatLieu } from "./ListeEtatLieu";
import { NavBarEtatLieu } from "./NavBarEtatLieu";
import { ListEtatLieuxToDo } from "./ListeEtatLieuToDo";
import { EtatLieuForm } from "./EtatLieuForm";

export function EtatLieu() {
    return (
        <div>
            <NavBarEtatLieu />
            <Routes>
                <Route path="/" element={<ListeEtatLieu/>}/>
                <Route path="/afaireEntree" element={<ListEtatLieuxToDo type="entree"/>}/>
                <Route path="/afaireSortie" element={<ListEtatLieuxToDo type="sortie"/>}/>
                <Route path="/form" element={<EtatLieuForm />}/>
            </Routes>
        </div>
    )
}