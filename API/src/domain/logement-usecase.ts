import { DataSource } from "typeorm";
import { StatutLogement, TypeBien, TypeLocation } from "../types/express";
import { Logement } from "../database/entities/logement";

interface UpdateLogementParams {
    typeLocation?: TypeLocation
    nbChambres?: number
    capacite?: number
    surface?: number
    prixNuit?: number
    imageSource?: string
}

interface FiltersLogement {
    typeLogement?: TypeBien
    typeLocation?: TypeLocation
    nbChambres?: number
    capacite?: number
    surface?: number
    prixNuit?: number,
    statut?: StatutLogement,
    userId?: number
}

export class LogementUseCase {
    constructor(private readonly db: DataSource) { }

    async updateLogement(id: number, params: UpdateLogementParams): Promise<Logement | null> {
        const logementRepo = this.db.getRepository(Logement)
        const logementFound = await logementRepo.findOne({where: {id: id}})
        if (logementFound === null) return null

        if(params.typeLocation) {
            logementFound.typeLocation = params.typeLocation
        }

        if(params.nbChambres) {
            logementFound.nbChambres = params.nbChambres
        }

        if(params.capacite) {
            logementFound.capacite = params.capacite
        }

        if(params.surface) {
            logementFound.surface = params.surface
        }

        if(params.prixNuit) {
            logementFound.prixNuit = params.prixNuit
        }

        if(params.imageSource) {
            logementFound.imageSource = params.imageSource
        }

        const updatedLogement = await logementRepo.save(logementFound)
        return updatedLogement
    }

    async listLogement(filters: FiltersLogement): Promise<{logements: Logement[]}> {
        const query = this.db.createQueryBuilder(Logement, 'logement')
        query.innerJoinAndSelect("logement.user","user")

        if(filters.typeLogement !== undefined) {
            query.andWhere("logement.typeLogement = :typeLogement", {typeLogement: filters.typeLogement})
        }

        if(filters.typeLocation !== undefined) {
            query.andWhere("logement.typeLocation = :typeLocation", {typeLocation: filters.typeLocation})
        }

        if(filters.nbChambres !== undefined) {
            query.andWhere("logement.nbChambres = :nbChambres", {nbChambres: filters.nbChambres})
        }

        if(filters.capacite !== undefined) {
            query.andWhere("logement.capacite = :capacite", {capacite: filters.capacite})
        }

        if(filters.surface !== undefined) {
            query.andWhere("logement.surface = :surface", {surface: filters.surface})
        }

        if(filters.prixNuit !== undefined) {
            query.andWhere("logement.prixNuit = :prixNuit", {prixNuit: filters.prixNuit})
        }

        if(filters.statut !== undefined) {
            query.andWhere("logement.statut = :statut", {statut: filters.statut})
        }

        if(filters.userId !== undefined) {
            query.andWhere("user.id = :userId", {userId: filters.userId})
        }

        const logements = await query.getMany()
        return {
            logements
        }
    }

    async getLogement(id: number): Promise <Logement | null> {
        return await this.db.getRepository(Logement).findOne({where: {id: id}})
    }

    async deleteLogement(id: number): Promise <Logement | null> {
        const logementRepo = this.db.getRepository(Logement)
        const logementFound = await logementRepo.findOne({where: {id: id}})
        if (logementFound === null) return null

        await logementRepo.delete({id})
        return logementFound
    }

    async updateStatutLogement(id: number, statut: StatutLogement): Promise <Logement | null> {
        const logementRepo = this.db.getRepository(Logement)
        const logementFound = await logementRepo.findOne({where: {id: id}})
        if (logementFound === null) return null

        logementFound.statut = statut

        const updatedLogement = await logementRepo.save(logementFound)
        return updatedLogement
    }
}