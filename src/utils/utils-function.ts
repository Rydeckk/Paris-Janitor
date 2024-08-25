import { TypeUser, UserInfoWithId } from "../types/types";

export function formatDateToLocalISOString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const trueDate = new Date(date)
    const year = trueDate.getFullYear();
    const month = pad(trueDate.getMonth() + 1);
    const day = pad(trueDate.getDate());
    const hours = pad(trueDate.getHours());
    const minutes = pad(trueDate.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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