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
