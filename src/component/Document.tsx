import { Route, Routes } from "react-router-dom";
import { NavBarDocument } from "./NavBarDocument";
import { ListeDevis } from "./ListeDevis";

export function Document() {
    return (
        <div>
            <NavBarDocument />
            <Routes>
                <Route path={"/"} element={<ListeDevis />}></Route>
                <Route path={"/facture"} />
            </Routes>
        </div>
    )
}