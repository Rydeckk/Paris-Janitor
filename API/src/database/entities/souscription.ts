import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Abonnement } from "./abonnement";
import { Facture } from "./facture";

const today = new Date()
const datePlusUnAn = new Date(today.getFullYear()+1, today.getMonth(), today.getDate())

@Entity({name: "Souscription"})
export class Souscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "date"})
    dateDebut: Date

    @Column({type: "date"})
    dateFin: Date

    @ManyToOne(() => User, user => user.souscriptions)
    user: User

    @ManyToOne(() => Abonnement, abonnement => abonnement.souscriptions)
    abonnement: Abonnement

    @OneToOne(() => Facture, facture => facture.souscription, {onDelete: "CASCADE"})
    @JoinColumn()
    facture: Facture

    constructor(id: number, dateDebut: Date, dateFin: Date, user: User,abonnement: Abonnement, facture: Facture) {
        this.id = id,
        this.dateDebut = dateDebut,
        this.dateFin = dateFin,
        this.user = user,
        this.abonnement = abonnement,
        this.facture = facture
    }
}