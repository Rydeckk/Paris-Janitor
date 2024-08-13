import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "Service"})
export class Service {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    type: string

    @Column()
    prix: number

    constructor(id: number, nom: string, type: string, prix: number) {
        this.id = id,
        this.nom = nom,
        this.type = type,
        this.prix = prix
    }
}