import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Reservation } from "./reservation";
import { Souscription } from "./souscription";

@Entity({name: "Facture"})
export class Facture {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nomFacture: string

    @Column()
    numeroFacture: string

    @Column()
    nomPersonne: string

    @Column()
    prenom: string

    @Column({type: "decimal", precision: 10, scale: 2})
    montant: number

    @CreateDateColumn({type: "datetime"})
    dateCreation: Date

    @ManyToOne(() => User, user => user.factures)
    user: User

    @OneToOne(() => Reservation, reservation => reservation.facture, {onDelete: "CASCADE"})
    reservation: Reservation

    @OneToOne(() => Souscription, souscription => souscription.facture, {onDelete: "CASCADE"})
    souscription: Souscription

    constructor(id: number, nomFacture: string, numeroFacture: string, nomPersonne: string, prenom: string, montant: number, dateCreation: Date, user: User, reservation: Reservation, souscription: Souscription) {
        this.id = id,
        this.nomFacture = nomFacture,
        this.numeroFacture = numeroFacture,
        this.nomPersonne = nomPersonne,
        this.prenom = prenom,
        this.montant = montant,
        this.dateCreation = dateCreation,
        this.user = user,
        this.reservation = reservation,
        this.souscription = souscription
    }
}