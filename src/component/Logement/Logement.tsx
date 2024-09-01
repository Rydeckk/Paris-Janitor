import { Route, Routes } from "react-router-dom";
import { NavBarListeLogement } from "./NavBarListeLogement";
import { ListeLogements } from "./ListeLogements";
import { useState } from "react";

export function Logement() {
    const [isVisibleNav, setIsvisibleNav] = useState(true)

    return (
        <div>
            {isVisibleNav && (<NavBarListeLogement />)}
            <Routes>
                <Route path="/*" element={<ListeLogements onClickLogement={() => setIsvisibleNav(false)} onReturn={() => setIsvisibleNav(true)}/>}/>
                <Route path="/avalider/*" element={<ListeLogements statut="attenteValidation" onClickLogement={() => setIsvisibleNav(false)} onReturn={() => setIsvisibleNav(true)}/>}/>
            </Routes>
        </div>
        
    )
}