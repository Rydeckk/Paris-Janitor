import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EtatEquip } from "../../types/types";
import { EtatLieu } from "./etatLieu";
import { Equipement } from "./equipement";

@Entity({name: "EtatsEquipement"})
export class EtatEquipement {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    etat: EtatEquip

    @ManyToOne(() => EtatLieu, etatlieu => etatlieu.etatEquipements)
    etatLieu: EtatLieu

    @ManyToOne(() => Equipement)
    equipement: Equipement

    constructor(id: number, etat: EtatEquip, etatLieu: EtatLieu, equipement: Equipement) {
        this.id = id, 
        this.etat = etat,
        this.etatLieu = etatLieu,
        this.equipement = equipement
    }
}