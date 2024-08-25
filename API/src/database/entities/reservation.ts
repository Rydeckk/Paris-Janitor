import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Service } from "./service";
import { Logement } from "./logement";

@Entity({name: "Reservation"})
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "date"})
    dateDebut: Date

    @Column({type: "date"})
    dateFin: Date

    @Column({type: "decimal", precision: 10, scale: 2})
    montant: number

    @ManyToOne(() => User, user => user.reservations)
    user: User

    @ManyToOne(() => Logement, logement => logement.reservations)
    logement: Logement

    @ManyToMany(() => Service, service => service.reservations)
    @JoinTable({name: "Service_reserve"})
    services: Service[]

    constructor(id: number, dateDebut: Date, dateFin: Date, montant: number, user: User, logement: Logement, services: Service[]) {
        this.id = id,
        this.dateDebut = dateDebut,
        this.dateFin = dateFin,
        this.montant = montant,
        this.user = user,
        this.logement = logement,
        this.services = services
    }
}