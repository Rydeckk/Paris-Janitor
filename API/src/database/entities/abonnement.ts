import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Souscription } from "./souscription";

@Entity({name: "Abonnement"})
export class Abonnement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    montant: number

    @OneToMany(() => Souscription, souscription => souscription.abonnement)
    souscriptions: Souscription[]

    constructor(id: number, nom: string, montant: number, souscriptions: Souscription[]) {
        this.id = id,
        this.nom = nom,
        this.montant = montant,
        this.souscriptions = souscriptions
    }
}