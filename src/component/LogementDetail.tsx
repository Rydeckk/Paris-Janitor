import { useState } from "react";
import { Logement, Service } from "../types/types";
import { NavBarLogement } from "./NavBarLogement";
import { Route, Routes, useLocation } from "react-router-dom";
import { LogementInfo } from "./LogementInfo";
import { LogementCalendrier } from "./LogementCalendrier";
import { LogementReservation } from "./LogementReservation";
import { LogementService } from "./LogementService";

interface LogementDetailProps {
    logement: Logement
    onUpdate: (logement: Logement) => void
    onReturn: () => void
}

export function LogementDetail({logement, onUpdate, onReturn}: LogementDetailProps) {
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
                <Route path={"/reservation"} element={<LogementReservation logement={logement}/>}/>
            </Routes>
        </div>
    )
}