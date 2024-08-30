import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatutLogement, TypeBien, TypeLocation } from "../../types/types"
import { User } from "./user";
import { Photo } from "./photo";
import { Service } from "./service";
import { DateIndisponible } from "./dateIndisponible";
import { Reservation } from "./reservation";

@Entity({name: "Logement"})
export class Logement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    adresse: string

    @Column()
    codePostal: string

    @Column()
    ville: string

    @Column()
    pays: string

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

    @Column({default: "attenteValidation"})
    statut: StatutLogement

    @Column({default: true})
    isActif: boolean

    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @OneToMany(() => Photo, photo => photo.logement, {onDelete: 'CASCADE'})
    photos: Photo[]

    @OneToMany(() => DateIndisponible, dateIndisponible => dateIndisponible.logement, {onDelete: 'CASCADE'})
    datesIndisponibles: DateIndisponible[] 

    @OneToMany(() => Reservation, reservation => reservation.logement, {onDelete: 'CASCADE'})
    reservations: Reservation[]

    @ManyToOne(() => User, user => user.logements)
    user: User

    @ManyToMany(() => Service, service => service.logements, {onDelete: 'CASCADE'})
    @JoinTable({name: "ServiceLogement"})
    services: Service[]

    constructor(id: number, nom: string, adresse: string, ville: string, pays: string, codePostal: string, typeLogement: TypeBien, typeLocation: TypeLocation, nbChambres: number, capacite: number, 
    surface: number,prixNuit: number, statut: StatutLogement, isActif: boolean, createdAt: Date, photos: Photo[], datesIndisponibles: DateIndisponible[], reservations: Reservation[], user: User, services: Service[]) {
        this.id = id,
        this.nom = nom,
        this.adresse = adresse,
        this.ville = ville,
        this.pays = pays,
        this.codePostal = codePostal,
        this.typeLogement = typeLogement,
        this.typeLocation = typeLocation,
        this.nbChambres = nbChambres,
        this.capacite = capacite,
        this.surface = surface,
        this.prixNuit = prixNuit,
        this.statut = statut,
        this.isActif = isActif,
        this.createdAt = createdAt,
        this.photos = photos,
        this.datesIndisponibles = datesIndisponibles,
        this.reservations = reservations,
        this.user = user,
        this.services = services
    }
}