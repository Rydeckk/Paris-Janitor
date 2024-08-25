import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypeService } from "../../types/types"
import { Logement } from "./logement";
import { Reservation } from "./reservation";

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

    @ManyToMany(() => Reservation, reservation => reservation.services)
    reservations: Reservation[]

    constructor(id: number, nom: string, type: TypeService, prix: number, logements: Logement[], reservations: Reservation[]) {
        this.id = id,
        this.nom = nom,
        this.type = type,
        this.prix = prix,
        this.logements = logements,
        this.reservations = reservations
    }
}