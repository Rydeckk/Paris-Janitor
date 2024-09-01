import { useState } from "react";
import { Logement, Service } from "../../types/types";
import { NavBarLogement } from "./NavBarLogement";
import { Route, Routes, useLocation } from "react-router-dom";
import { LogementInfo } from "./LogementInfo";
import { LogementCalendrier } from "./LogementCalendrier";
import { LogementReservation } from "./LogementReservation";
import { LogementService } from "./LogementService";
import { LogementHistorique } from "./LogementHistorique";
import { ListeEquipement } from "../Equipement/ListeEquipement";
import { useUserContext } from "../../main";
import { ListeEtatLieu } from "../EtatLieu/ListeEtatLieu";

interface LogementDetailProps {
    logement: Logement
    onUpdate: (logement: Logement) => void
    onReturn: () => void
}

export function LogementDetail({logement, onUpdate, onReturn}: LogementDetailProps) {
    const user = useUserContext()

    const handleUpdate = (logementUpdated: Logement) => {
        onUpdate(logementUpdated)
    }

    return (
        <div>
            <NavBarLogement />
            <Routes>
                <Route path={"/"} element={<LogementInfo logement={logement} onUpdate={(logement) => handleUpdate(logement)} onReturn={onReturn}/>} />
                <Route path={"/calendrier"} element={<LogementCalendrier logement={logement} onUpdate={(logement) => handleUpdate(logement)} onReturn={onReturn}/>}/>
                <Route path={"/service"} element={<LogementService logement={logement} onUpdate={(logement) => handleUpdate(logement)} onReturn={onReturn} space="owner"/>}/>
                <Route path={"/historique"} element={<LogementHistorique logement={logement} onReturn={onReturn}/>}/>
                <Route path={"/reservation"} element={<LogementReservation logement={logement} onUpdate={(logement) => handleUpdate(logement)} onReturn={onReturn}/>}/>
                <Route path={"/equipement"} element={<ListeEquipement logement={logement} onUpdate={(logement) => handleUpdate(logement)} onReturn={onReturn}/>}/>
                <Route path={"/etatLieu"} element={<ListeEtatLieu logement={logement} onReturn={onReturn}/>}/>
            </Routes>
        </div>
    )
}