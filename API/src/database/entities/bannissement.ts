import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity({name: "Bannissement"})
export class Bannissement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    motif: string

    @Column({type: "date"})
    dateDebut: Date

    @Column({type: "date", nullable: true})
    dateFin: Date

    @ManyToOne(() => User, user => user.bannissements)
    user: User

    constructor(id: number, motif: string, dateDebut: Date, dateFin: Date, user: User) {
        this.id = id,
        this.motif = motif,
        this.dateDebut = dateDebut,
        this.dateFin = dateFin,
        this.user = user
    }
}