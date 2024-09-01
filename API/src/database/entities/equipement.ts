import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Logement } from "./logement";
import { EtatEquip } from "../../types/types";
import { EtatEquipement } from "./etatEquipement";

@Entity({name: "Equipement"})
export class Equipement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    etat: EtatEquip

    @ManyToOne(() => Logement, logement => logement.equipements)
    logement: Logement

    constructor(id: number, nom: string, etat: EtatEquip, logement: Logement) {
        this.id = id,
        this.nom = nom,
        this.etat = etat,
        this.logement = logement
    }
}