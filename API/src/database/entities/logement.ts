import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatutLogement, TypeBien, TypeLocation } from "../../types/express";
import { User } from "./user";
import { Photo } from "./photo";
import { Service } from "./service";

@Entity({name: "Logement"})
export class Logement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

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

    @Column({default: "en attente"})
    statut: StatutLogement

    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @OneToMany(() => Photo, photo => photo.logement)
    photos: Photo[]

    @ManyToOne(() => User, user => user.logements, {onDelete: 'CASCADE'})
    user: User

    @ManyToMany(() => Service, service => service.logements)
    @JoinTable({name: "ServiceLogement"})
    services: Service[]

    constructor(id: number, nom: string, adresse: string, typeLogement: TypeBien, typeLocation: TypeLocation, nbChambres: number, capacite: number, 
    surface: number,prixNuit: number,imageSource: string, statut: StatutLogement, createdAt: Date, photos: Photo[], user: User, services: Service[]) {
        this.id = id,
        this.nom = nom,
        this.adresse = adresse,
        this.typeLogement = typeLogement,
        this.typeLocation = typeLocation,
        this.nbChambres = nbChambres,
        this.capacite = capacite,
        this.surface = surface,
        this.prixNuit = prixNuit,
        this.statut = statut,
        this.createdAt = createdAt,
        this.photos = photos,
        this.user = user,
        this.services = services
    }
}