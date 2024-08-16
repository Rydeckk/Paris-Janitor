import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Logement } from "./logement";

@Entity({name: "Photo"})
export class Photo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default: "/public/images/"})
    path: string

    @ManyToOne(() => Logement, logement => logement.photos)
    logement: Logement

    constructor(id: number, name: string, path: string, logement: Logement) {
        this.id =id,
        this.name = name,
        this.path = path,
        this.logement = logement
    }
}