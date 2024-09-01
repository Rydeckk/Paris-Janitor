import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, ManyToMany } from "typeorm"
import { Token } from "./token"
import { Role } from "./role"
import { Logement } from "./logement"
import { Devis } from "./devis"
import { Reservation } from "./reservation"
import { Facture } from "./facture"
import { Souscription } from "./souscription"
import { Bannissement } from "./bannissement"
import { Operation } from "./operation"
import { Note } from "./note"

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

    @Column()
    phone: string

    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @ManyToOne(() => Role, role => role.users)
    role: Role

    @OneToMany(() => Token, token => token.user, {onDelete: 'CASCADE'})
    tokens: Token[]

    @OneToMany(() => Logement, logement => logement.user, {onDelete: 'CASCADE'})
    logements: Logement[]

    @OneToMany(() => Devis, devis => devis.user)
    devis: Devis[]
    
    @OneToMany(() => Facture, facture => facture.user)
    factures: Facture[]

    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations: Reservation[]

    @OneToMany(() => Souscription, souscription => souscription.user)
    souscriptions: Souscription[]

    @OneToMany(() => Bannissement, banni => banni.user)
    bannissements: Bannissement[]

    @OneToMany(() => Operation, operation => operation.user)
    operations: Operation[]

    @OneToMany(() => Note, note => note.user)
    notes: Note[]

    constructor(id: number, email: string, password: string, firstName: string, lastName: string, phone: string, role: Role
        , createdAt: Date, tokens: Token[], logements: Logement[], devis: Devis[], factures: Facture[], reservations: Reservation[]
        , souscriptions: Souscription[], bannissements: Bannissement[], operations: Operation[], notes: Note[]) {
            this.id = id,
            this.email = email,
            this.password = password,
            this.firstName = firstName,
            this.lastName = lastName,
            this.phone = phone,
            this.role = role
            this.createdAt = createdAt,
            this.tokens = tokens,
            this.logements = logements,
            this.devis = devis,
            this.factures = factures,
            this.reservations = reservations,
            this.souscriptions = souscriptions,
            this.bannissements = bannissements,
            this.operations = operations,
            this.notes = notes
    }
}