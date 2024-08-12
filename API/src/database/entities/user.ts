import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, ManyToMany } from "typeorm"
import { Token } from "./token"
import { Role } from "./role"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    email: string

    @Column()
    password: string

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    firstName: string

    @Column({charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci'})
    lastName: string

    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @ManyToOne(() => Role, role => role.users)
    role: Role

    @OneToMany(() => Token, token => token.user, {onDelete: 'CASCADE'})
    tokens: Token[]

    constructor(id: number, email: string, password: string, firstName: string, lastName: string, role: Role, createdAt: Date, tokens: Token[]) {
            this.id = id,
            this.email = email,
            this.password = password,
            this.firstName = firstName,
            this.lastName = lastName,
            this.role = role
            this.createdAt = createdAt,
            this.tokens = tokens
    }
}