import { DataSource } from "typeorm";
import { Souscription } from "../database/entities/souscription";
import { User } from "../database/entities/user";

interface GetListFilters {
    userId?: number
}

export class SouscriptionUseCase {
    constructor(private readonly db: DataSource) { }

    async getListSouscription(listFilters: GetListFilters): Promise<{souscriptions: Souscription[]}> {
        const query = this.db.createQueryBuilder(Souscription, "souscription")
        query.innerJoinAndSelect("souscription.user", "user")
        query.innerJoinAndSelect("souscription.abonnement", "abonnement")
        query.innerJoinAndSelect("souscription.facture","facture")

        if(listFilters.userId) {
            query.andWhere("user.id = :userId", {userId: listFilters.userId})
        }

        const souscriptions = await query.getMany()
        return {
            souscriptions: souscriptions
        }
    }

    async getMyActualSouscription(userId: number): Promise<Souscription | null> {
        const query = this.db.createQueryBuilder(Souscription, "souscription")
        query.innerJoinAndSelect("souscription.user", "user")
        query.innerJoinAndSelect("souscription.abonnement", "abonnement")
        query.innerJoinAndSelect("souscription.facture","facture")
        query.where("user.id = :userId", {userId: userId})
        query.andWhere("souscription.dateDebut <= :date", {date: new Date()})
        query.andWhere("souscription.dateFin >= :date", {date: new Date()})

        const souscriptionFound = await query.getOne()
        return souscriptionFound
    }

    async getLastSouscription(userId: number): Promise<Souscription | null> {
        const query = this.db.createQueryBuilder(Souscription, "souscription")
        query.innerJoinAndSelect("souscription.user", "user")
        query.innerJoinAndSelect("souscription.abonnement", "abonnement")
        query.innerJoinAndSelect("souscription.facture","facture")
        query.where("user.id = :userId", {userId: userId})
        query.addOrderBy("souscription.dateFin","DESC")
        const souscriptionFound = await query.getOne()

        if(souscriptionFound === null) return null
        return souscriptionFound
    }
}