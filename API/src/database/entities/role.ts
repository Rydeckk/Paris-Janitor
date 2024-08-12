import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity({name: "Role"})
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    name: string

    @Column({default: false})
    isOwner: boolean

    @Column({default: false})
    isAdmin: boolean

    @OneToMany(() => User, user => user.role)
    users: User[];

    constructor(id: number, name: string, isOwner: boolean, isAdmin: boolean, users: User[]) {
        this.id = id,
        this.name = name,
        this.isOwner = isOwner,
        this.isAdmin = isAdmin,
        this.users = users
    }
}