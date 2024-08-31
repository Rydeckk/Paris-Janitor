import { DataSource } from "typeorm"
import { Bannissement } from "../database/entities/bannissement"

export class BannissementUseCase {
    constructor(private readonly db: DataSource) { }

    async getListBannissement(): Promise <{bannissements: Bannissement[]}> {
        const query = this.db.createQueryBuilder(Bannissement, "bannissement")
        query.innerJoinAndSelect("bannissement.user","user")
        query.orderBy("bannissement.dateFin","DESC")

        const bannissements = await query.getMany()
        return {
            bannissements: bannissements
        }
    }

    async getBannissement(id: number): Promise<Bannissement | null> {
        const repo = this.db.getRepository(Bannissement)
        const bannissementFound = await repo.findOne({where: {id: id}, relations: ["user"]})
        if(bannissementFound === null) return null

        return bannissementFound
    }

    async getActualBannissement(id: number): Promise<Bannissement| null> {
        const query = this.db.createQueryBuilder(Bannissement, "banni")
        query.innerJoinAndSelect("banni.user","user")
        query.where("user.id = :userId", {userId: id})
        query.andWhere("banni.dateDebut <= :date", {date: new Date()})
        query.andWhere("banni.dateFin > :date", {date: new Date()})

        const bannissement = await query.getOne()
        if(bannissement === null) return null
        return bannissement
    }

}