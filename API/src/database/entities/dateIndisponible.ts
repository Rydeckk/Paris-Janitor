import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Logement } from "./logement";

@Entity({name: "DateIndisponible"})
export class DateIndisponible {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "date"})
    date: Date

    @ManyToOne(() => Logement, logement => logement.datesIndisponibles)
    logement: Logement

    constructor(id: number, date: Date, logement: Logement) {
        this.id = id,
        this.date = date,
        this.logement = logement
    }
}