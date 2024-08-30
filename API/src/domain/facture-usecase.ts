import { DataSource } from "typeorm"
import { Facture } from "../database/entities/facture"
import { User } from "../database/entities/user"

interface ListFactureFilter {
    user?: User
}

export class FactureUseCase {
    constructor(private readonly db: DataSource) { }

    async getFacture(id: number): Promise <Facture | null> {
        const factureFound = await this.db.getRepository(Facture).findOne({where: {id: id}, relations: ["user","reservation","souscription"]})
        if(factureFound === null) return null

        return factureFound
    }

    async getListFacture(filter: ListFactureFilter): Promise<{factures: Facture[]}> {
        const query = this.db.createQueryBuilder(Facture, "facture")
        query.leftJoinAndSelect("facture.user", "user")
        query.leftJoinAndSelect("facture.reservation", "reservation")
        query.leftJoinAndSelect("facture.souscription", "souscription")
        
        if(filter.user) {
            query.andWhere("user.id = :userId", {userId: filter.user.id})
        }

        const factures = await query.getMany()
        return {
            factures
        }
    }
}