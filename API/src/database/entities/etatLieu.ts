import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./reservation";
import { EtatEquipement } from "./etatEquipement";

@Entity({name: "EtatLieux"})
export class EtatLieu {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nomEtatLieu: string

    @Column()
    nom: string

    @Column()
    prenom: string

    @CreateDateColumn({type: "datetime"})
    dateCreation: Date

    @OneToMany(() => EtatEquipement, etatEquipement => etatEquipement.etatLieu)
    etatEquipements: EtatEquipement[]

    @OneToOne(() => Reservation, reservation => reservation.etatLieuEntree)
    @JoinColumn()
    reservationEntree: Reservation

    @OneToOne(() => Reservation, reservation => reservation.etatLieuSortie)
    @JoinColumn()
    reservationSortie: Reservation

    constructor(id: number, nomEtatLieu: string, nom: string, prenom: string, dateCreation: Date, etatEquipements: EtatEquipement[], reservationEntree: Reservation, reservationSortie: Reservation) {
        this.id = id,
        this.nomEtatLieu = nomEtatLieu,
        this.nom = nom, 
        this.prenom = prenom,
        this.dateCreation = dateCreation,
        this.etatEquipements = etatEquipements,
        this.reservationEntree = reservationEntree,
        this.reservationSortie = reservationSortie
    }
}