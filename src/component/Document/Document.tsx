import { Route, Routes } from "react-router-dom";
import { NavBarDocument } from "./NavBarDocument";
import { ListeDevis } from "./ListeDevis";
import { ListeFacture } from "./ListeFacture";

export function Document() {
    return (
        <div>
            <NavBarDocument />
            <Routes>
                <Route path={"/"} element={<ListeDevis />} />
                <Route path={"/facture"} element={<ListeFacture />} />
            </Routes>
        </div>
    )
}