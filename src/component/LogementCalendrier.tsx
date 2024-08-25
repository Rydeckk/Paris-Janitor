import { useEffect, useState } from "react";
import { Logement } from "../types/types"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getDatesInRange, isSameDate } from "../utils/utils-function";
import { useUserContext } from "../main";
import { createDateIndisponible } from "../request/requestDateIndisponible";
import { getLogement } from "../request/requestLogement";

interface LogementCalendrierProps {
    logement: Logement
    onReturn: () => void
    onUpdate: (logementUpdated: Logement) => void
}

const today = new Date()
const datePlus5ans = new Date(today)
datePlus5ans.setFullYear(today.getFullYear() + 5)

export function LogementCalendrier({logement, onReturn, onUpdate}: LogementCalendrierProps) {
    const [date, setDate] = useState<[Date, Date] | Date | null>(null)
    const [datesDesactiveTmp, setDatesDesactiveTmp] = useState<Date[]>([])
    const [datesDesactive, setDatesDesactive] = useState<Date[]>([])
    const user = useUserContext()

    useEffect(() => {
        if(logement.datesIndisponibles.length > 0) {
            setDatesDesactive(logement.datesIndisponibles.map((dateIndisponible) => new Date(dateIndisponible.date)))
        }
    }, [logement])

    const handleDateChange = (dates: [Date, Date] | Date | null) => {
        if (Array.isArray(dates)) {
            const [start, end] = dates
            
            const isRangeValid = !getDatesInRange(start, end).some(date => 
                datesDesactiveTmp.some(dateDesactive => isSameDate(dateDesactive, date))
            )
      
            if (isRangeValid) {
                setDate(dates)
            } else {
                let message: string = ""
                user.user?.role.isOwner ? message = "Vous ne pouvez pas sélectionner une plage contenant des dates désactivées." : message = "Vous ne pouvez pas réservez une plage contenant des dates réservées"
                alert(message)
            }
        } else {
            setDate(dates)
        }
    }

    const tileDesactive = ({ date }: { date: Date }) => {
        return datesDesactiveTmp.some(dateDesactive => isSameDate(dateDesactive, date)) || datesDesactive.some(dateDesactive => isSameDate(dateDesactive, date))
    }

    const handleDisableDates = () => {
        if (Array.isArray(date)) {
            
            setDatesDesactiveTmp([...datesDesactiveTmp, ...getDatesInRange(date[0], date[1])]);
        } else if (date) {
            setDatesDesactiveTmp([...datesDesactiveTmp, date]);
        }
    }

    const handleSaveDisabledDates = async () => {
        const ok = confirm("Si vous enregistrer ses dates, vous ne pourrez plus les modifier !")
        if(ok) {
            
            const logementUpdated = await createDateIndisponible(logement.id, datesDesactiveTmp)
            
            if(logementUpdated) {
                setDatesDesactive([...datesDesactive,...datesDesactiveTmp])
                setDatesDesactiveTmp([])
                onUpdate(logementUpdated)
            }
            
        }
    }

    const handleCancelDisabledDates = () => {
        setDatesDesactiveTmp([])
    }

    return (
        <div>
            <div className="div_detail">
                <div className="div_detail_calendrier">
                    <Calendar locale="fr" onChange={(value) => handleDateChange(value as [Date, Date] | Date | null)} value={date} selectRange={true} minDate={new Date()} maxDate={datePlus5ans} tileDisabled={tileDesactive}/>
                </div>
                <div className="div_end">
                    <button disabled={date === null} className="button" onClick={handleDisableDates}>Bloquer</button>
                    <button disabled={datesDesactiveTmp.length === 0} className="button" onClick={handleSaveDisabledDates}>Enregistrer</button>
                    <button disabled={datesDesactiveTmp.length === 0} className="button" onClick={handleCancelDisabledDates}>Annuler</button>
                </div>
            </div>
            <div className="div_return">
                <img src="/icone/return.png"></img>
                <label onClick={() => onReturn()}>Retour à la liste</label>
            </div>
        </div>
        
        
    )
}