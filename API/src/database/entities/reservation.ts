import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Service } from "./service";
import { Logement } from "./logement";
import { Facture } from "./facture";

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

    @CreateDateColumn({type: "datetime"})
    dateCreation: Date

    @ManyToOne(() => User, user => user.reservations)
    user: User

    @ManyToOne(() => Logement, logement => logement.reservations)
    logement: Logement

    @ManyToMany(() => Service, service => service.reservations)
    @JoinTable({name: "Service_reserve"})
    services: Service[]

    @OneToOne(() => Facture, facture => facture.reservation, {onDelete: "CASCADE"})
    @JoinColumn()
    facture: Facture

    constructor(id: number, dateDebut: Date, dateFin: Date, dateCreation: Date, montant: number, user: User, logement: Logement, services: Service[], facture: Facture) {
        this.id = id,
        this.dateDebut = dateDebut,
        this.dateFin = dateFin,
        this.montant = montant,
        this.dateCreation = dateCreation,
        this.user = user,
        this.logement = logement,
        this.services = services,
        this.facture = facture
    }
}