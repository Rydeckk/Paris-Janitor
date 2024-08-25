import { DataSource } from "typeorm";
import { TypeService } from "../types/types"
import { Service } from "../database/entities/service";

interface UpdateServiceParams {
    nom?: string,
    type?: TypeService,
    prix?: number
}

interface FiltersService {
    type?: TypeService
}

export class ServiceUseCase {
    constructor(private readonly db: DataSource) { }

    async updateService(id: number, params: UpdateServiceParams): Promise<Service | null> {
        const serviceRepo = this.db.getRepository(Service)
        const serviceFound = await serviceRepo.findOne({where: {id: id}})
        if (serviceFound === null) return null

        if(params.nom) {
            serviceFound.nom = params.nom
        }

        if(params.type) {
            serviceFound.type = params.type
        }

        if(params.prix) {
            serviceFound.prix = params.prix
        }

        const updatedService = await serviceRepo.save(serviceFound)
        return updatedService
    }

    async listService(filters: FiltersService): Promise<{services: Service[]}> {
        const query = this.db.createQueryBuilder(Service, 'service')

        if(filters.type !== undefined) {
            query.andWhere("service.type = :type", {type: filters.type})
        }

        const services = await query.getMany()
        return {
            services
        }
    }

    async getService(id: number): Promise <Service | null> {
        const query = this.db.createQueryBuilder(Service,"service")
        query.where("service.id = :serviceId", {serviceId: id})
        query.leftJoinAndSelect("service.logements","logement")
        query.leftJoinAndSelect("service.reservations", "reservation")

        const serviceFound = query.getOne()
        if(serviceFound === null) return null

        return serviceFound
    }

    async deleteService(id: number): Promise <Service | null> {
        const serviceRepo = this.db.getRepository(Service)
        const serviceFound = await serviceRepo.findOne({where: {id: id}})
        if (serviceFound === null) return null

        await serviceRepo.delete({id})
        return serviceFound
    }
}