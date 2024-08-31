import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { TypeOperation } from "../../types/types";

@Entity({name: "Opérations"})
export class Operation {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "decimal", precision: 10, scale: 2})
    montant: number

    @Column()
    type: TypeOperation

    @Column()
    description: string

    @CreateDateColumn({type: "datetime"})
    dateExecuter: Date

    @ManyToOne(() => User, user => user.operations)
    user: User
    
    constructor(id: number, montant: number, type: TypeOperation, description: string ,dateExecuter: Date, user: User) {
        this.id = id,
        this.montant = montant,
        this.type = type,
        this.description = description,
        this.dateExecuter = dateExecuter,
        this.user = user
    }
}