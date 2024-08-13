import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatutLogement, TypeBien, TypeLocation } from "../../types/express";
import { User } from "./user";

@Entity({name: "Logement"})
export class Logement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    adresse: string

    @Column()
    typeLogement: TypeBien

    @Column()
    typeLocation: TypeLocation

    @Column()
    nbChambres: number

    @Column()
    capacite: number

    @Column()
    surface: number

    @Column()
    prixNuit: number

    @Column()
    imageSource: string

    @Column({default: "en attente"})
    statut: StatutLogement

    @ManyToOne(() => User, user => user.logements, {onDelete: 'CASCADE'})
    user: User

    constructor(id: number, adresse: string, typeLogement: TypeBien, typeLocation: TypeLocation, nbChambres: number, capacite: number, surface: number,prixNuit: number,imageSource: string, statut: StatutLogement, user: User) {
        this.id = id,
        this.adresse = adresse,
        this.typeLogement = typeLogement,
        this.typeLocation = typeLocation,
        this.nbChambres = nbChambres,
        this.capacite = capacite,
        this.surface = surface,
        this.prixNuit = prixNuit,
        this.imageSource = imageSource,
        this.statut = statut,
        this.user = user
    }
}