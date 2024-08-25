import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity({name: "Devis"})
export class Devis {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nomDevis: string

    @Column()
    nomPersonne: string

    @Column()
    prenom: string

    @Column({type: "decimal", precision: 10, scale: 2})
    montant: number

    @CreateDateColumn({type: "datetime"})
    dateCreation: Date

    @ManyToOne(() => User, user => user.devis)
    user: User

    constructor(id: number, nomDevis: string, nomPersonne: string, prenom: string, montant: number, dateCreation: Date, user: User) {
        this.id = id,
        this.nomDevis = nomDevis,
        this.nomPersonne = nomPersonne,
        this.prenom = prenom,
        this.montant = montant,
        this.dateCreation = dateCreation,
        this.user = user
    }
}