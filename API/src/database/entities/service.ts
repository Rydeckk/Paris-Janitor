import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypeService } from "../../types/types"
import { Logement } from "./logement";

@Entity({name: "Service"})
export class Service {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    type: TypeService

    @Column()
    prix: number

    @ManyToMany(() => Logement, logement => logement.services)
    logements: Logement[]

    constructor(id: number, nom: string, type: TypeService, prix: number, logements: Logement[]) {
        this.id = id,
        this.nom = nom,
        this.type = type,
        this.prix = prix,
        this.logements = logements
    }
}