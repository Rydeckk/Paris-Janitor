import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./reservation";

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

    @OneToOne(() => Reservation, reservation => reservation.etatLieuEntree || reservation.etatLieuSortie)
    @JoinColumn()
    reservation: Reservation

    constructor(id: number, nomEtatLieu: string, nom: string, prenom: string, dateCreation: Date, reservation: Reservation) {
        this.id = id,
        this.nomEtatLieu = nomEtatLieu,
        this.nom = nom, 
        this.prenom = prenom,
        this.dateCreation = dateCreation,
        this.reservation = reservation
    }
}