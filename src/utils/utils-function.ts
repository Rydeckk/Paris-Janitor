import { TypeUser, UserInfoWithId } from "../types/types";

export function formatDateToLocalISOString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const trueDate = new Date(date)
    const year = trueDate.getFullYear();
    const month = pad(trueDate.getMonth() + 1);
    const day = pad(trueDate.getDate());

    return `${year}-${month}-${day}`;
}

export function formatDateTimeToLocalString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const trueDate = new Date(date)
    const year = trueDate.getFullYear();
    const month = pad(trueDate.getMonth() + 1);
    const day = pad(trueDate.getDate());
    const hours = pad(trueDate.getHours());
    const minutes = pad(trueDate.getMinutes());

    return `${hours}:${minutes} ${day}/${month}/${year} `;
}

export function formatDateToLocalString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const trueDate = new Date(date)
    const year = trueDate.getFullYear();
    const month = pad(trueDate.getMonth() + 1);
    const day = pad(trueDate.getDate());

    return `${day}/${month}/${year}`;
}

export function getState(beginDate: Date, endDate: Date): "not_begin" | "pending" | "finish" {
    const today = new Date()
    const dateBegin = new Date(beginDate)
    const dateEnd = new Date(endDate)

    if(dateBegin > today) {
        return "not_begin"
    } else if(dateBegin <= today && dateEnd > today) {
        return "pending"
    } else {
        return "finish"
    }
}

export function getTypeUser(user: UserInfoWithId): TypeUser {
    if(user.role.isAdmin) {
        return 'admin'
    } else if (user.role.isOwner) {
        return 'owner'
    } else {
        return 'traveler'
    }
}

export function isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
}

export function getDatesInRange (startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

export function differenceEnJours(date1: Date, date2: Date): number {
    const newDate1 = new Date(date1)
    const newDate2 = new Date(date2)
    const millisecondesParJour = 1000 * 60 * 60 * 24 // Nombre de millisecondes dans une journée
    const diffInMs = Math.abs(newDate2.getTime() - newDate1.getTime())
    if(diffInMs < 0) {
        return Math.floor((Math.abs(newDate1.getTime() - newDate2.getTime())) / millisecondesParJour)
    }
    return Math.floor(diffInMs / millisecondesParJour)
}

export function getStatutSouscription(dateDebut: Date, dateFin: Date): string {
    const newDateDebut = new Date(dateDebut)
    const newDateFin = new Date(dateFin)
    const today = new Date()

    if(today > newDateFin) {
        return "Terminé"
    } else if (today <= newDateFin && today >= newDateDebut) {
        return "En cours"
    } else {
        return "Pas encore commencé"
    }
}