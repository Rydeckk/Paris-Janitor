import { DataSource } from "typeorm";
import { Devis } from "../database/entities/devis";
import { User } from "../database/entities/user";

interface ListDevisFilter {
    user?: User
}

export class DevisUseCase {
    constructor(private readonly db: DataSource) { }

    async getDevis(id: number): Promise <Devis | null> {
        const devisFound = await this.db.getRepository(Devis).findOne({where: {id: id}, relations: ["user"]})
        if(devisFound === null) return null

        return devisFound
    }

    async getListDevis(filter: ListDevisFilter): Promise<{devis: Devis[]}> {
        const query = this.db.createQueryBuilder(Devis, "devis")
        query.leftJoinAndSelect("devis.user", "user")
        
        if(filter.user) {
            query.andWhere("user.id = :userId", {userId: filter.user.id})
        }

        const devis = await query.getMany()
        return {
            devis
        }
    }
}