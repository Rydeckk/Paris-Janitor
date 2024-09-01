import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./service";
import { User } from "./user";

@Entity({name: "Notes"})
export class Note {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    titre: string

    @Column()
    numero: number

    @Column({default: ""})
    commentaire: string

    @ManyToOne(() => User, user => user.notes)
    user: User

    @ManyToOne(() => Service, service => service.notes)
    service: Service

    constructor(id: number, titre: string, numero: number, commentaire: string, user: User, service: Service) {
        this.id = id,
        this.titre = titre,
        this.numero = numero,
        this.commentaire = commentaire,
        this.user = user,
        this.service = service
    }
}