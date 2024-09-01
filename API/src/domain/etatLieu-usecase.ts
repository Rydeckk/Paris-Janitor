import { DataSource } from "typeorm";
import { EtatLieu } from "../database/entities/etatLieu";

interface Filter {
    logementId?: number
}

export class EtatLieuUseCase {
    constructor(private readonly db: DataSource) { }

    async getListEtatLieu(filter: Filter): Promise<{etatLieux: EtatLieu[]}> {
        const query = this.db.createQueryBuilder(EtatLieu,"etl")
        query.leftJoinAndSelect("etl.reservationEntree","reservationEntree")
        query.leftJoinAndSelect("etl.reservationSortie","reservationSortie")
        query.leftJoinAndSelect("reservationEntree.logement","logementEn")
        query.leftJoinAndSelect("reservationSortie.logement","logementSor")
        query.leftJoinAndSelect("etl.etatEquipements", "etatEquip")
        query.leftJoinAndSelect("etatEquip.equipement","equip")

        console.log(filter)

        if(filter.logementId) {
            
            query.andWhere("logementEn.id = :logementId", {logementId: filter.logementId})
            query.orWhere("logementSor.id = :logementId", {logementId: filter.logementId})
        }

        const etatLieux = await query.getMany()

        return {
            etatLieux
        }
    }

    async getEtatLieu(id: number): Promise<EtatLieu | null> {
        const repo = this.db.getRepository(EtatLieu)

        const etatLieuFound = await repo.findOne({where: {id:id}, relations: ["reservationEntree", "reservationSortie","etatEquipements","etatEquipements.equipement"]})
        if(etatLieuFound === null) return null

        return etatLieuFound
    }
}