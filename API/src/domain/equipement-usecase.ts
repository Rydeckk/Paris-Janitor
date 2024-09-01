import { DataSource } from "typeorm"
import { Equipement } from "../database/entities/equipement"
import { User } from "../database/entities/user"
import { Logement } from "../database/entities/logement"
import { EtatEquip } from "../types/types"

interface ListEquipementFilter {
    logementId?: number
}

interface EquipementUpdate {
    nom?: string, 
    etat?: EtatEquip
}

export class EquipementUseCase {
    constructor(private readonly db: DataSource) { }

    async getEquipement(id: number): Promise <Equipement | null> {
        const equipementFound = await this.db.getRepository(Equipement).findOne({where: {id: id}, relations: ["logement"]})
        if(equipementFound === null) return null

        return equipementFound
    }

    async getListEquipement(filter: ListEquipementFilter): Promise<{equipements: Equipement[]}> {
        const query = this.db.createQueryBuilder(Equipement, "equipement")
        query.innerJoinAndSelect("equipement.logement", "logement")
        
        if(filter.logementId) {
            query.andWhere("logement.id = :logementId", {logementId: filter.logementId})
        }

        const equipements = await query.getMany()
        return {
            equipements
        }
    }

    async updateEquipement(id: number, param: EquipementUpdate, logement: Logement): Promise<Equipement | null> {
        const query = this.db.createQueryBuilder(Equipement, "equipement")
        query.innerJoinAndSelect("equipement.logement", "logement")
        query.where("equipement.id = :equipementId", {equipementId: id})
        query.andWhere("logement.id = :logementId", {logementId: logement.id})

        const equipementFound = await query.getOne()
        if(equipementFound === null) return null

        if(param.nom) {
            equipementFound.nom = param.nom
        }

        if(param.etat) {
            equipementFound.etat = param.etat
        }

        const repo = this.db.getRepository(Equipement)
        const equipementUpdated = await repo.save(equipementFound)
        return equipementUpdated
    }

    async deleteEquipement(id: number, logement: Logement): Promise<Equipement | null> {
        const query = this.db.createQueryBuilder(Equipement, "equipement")
        query.innerJoinAndSelect("equipement.logement", "logement")
        query.where("equipement.id = :equipementId", {equipementId: id})
        query.andWhere("logement.id = :logementId", {logementId: logement.id})
        
        const equipementFound = await query.getOne()
        if(equipementFound === null) return null

        const repo = this.db.getRepository(Equipement)
        await repo.delete({id: id})
        return equipementFound
    }
}