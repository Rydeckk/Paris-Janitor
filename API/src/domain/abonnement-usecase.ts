import { DataSource } from "typeorm";
import { Abonnement } from "../database/entities/abonnement";
import { Souscription } from "../database/entities/souscription";
import { User } from "../database/entities/user";

interface AbonnementUpdate {
    nom?: string,
    montant?: number
}

export class AbonnementUseCase {
    constructor(private readonly db: DataSource) { }

    async getListAbonnement(): Promise <{abonnements: Abonnement[]}> {
        const query = this.db.createQueryBuilder(Abonnement, "abonnement")
        query.leftJoinAndSelect("abonnement.souscriptions","souscription")

        const abonnements = await query.getMany()
        return {
            abonnements: abonnements
        }
    }

    async getAbonnement(id: number): Promise<Abonnement | null> {
        const repo = this.db.getRepository(Abonnement)
        const abonnementFound = await repo.findOne({where: {id: id}, relations: ["souscriptions"]})
        if(abonnementFound === null) return null

        return abonnementFound
    }

    async updateAbonnement(id: number, updateParams: AbonnementUpdate): Promise<Abonnement | null> {
        const repo = this.db.getRepository(Abonnement)
        const abonnementFound = await repo.findOne({where: {id: id}, relations: ["souscriptions"]})
        if(abonnementFound === null) return null

        if(updateParams.nom) {
            abonnementFound.nom = updateParams.nom
        }

        if(updateParams.montant) {
            abonnementFound.montant = updateParams.montant
        }

        const abonnementUpdated = await repo.save(abonnementFound)
        return abonnementUpdated
    }

    async deleteAbonnement(id: number): Promise<Abonnement | null> {
        const repo = this.db.getRepository(Abonnement)
        const abonnementFound = await repo.findOne({where: {id: id}, relations: ["souscriptions"]})
        if(abonnementFound === null) return null

        await repo.delete({id})
        return abonnementFound
    }
}