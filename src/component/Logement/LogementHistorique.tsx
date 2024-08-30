import { Logement } from "../../types/types";
import { ListeReservation } from "./ListeReservation";

interface LogementHistoriqueProps {
    logement: Logement
    onReturn: () => void
}

export function LogementHistorique({logement, onReturn}: LogementHistoriqueProps) {
    return (
        <div>
            <ListeReservation logement={logement} />
            <div className="div_return">
                <img src="/icone/return.png"></img>
                <label onClick={() => onReturn()}>Retour à la liste</label>
            </div>
        </div>
    )
}