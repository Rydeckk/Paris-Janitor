import { DataSource } from "typeorm";
import { DateIndisponible } from "../database/entities/dateIndisponible";

export class DateIndisponibleUseCase {
    constructor(private readonly db: DataSource) { }

    async deleteDateIndisponible(id: number): Promise <DateIndisponible | null> {
        const dateIndisponibleFound = this.db.getRepository(DateIndisponible).findOneBy({id: id})
        if(dateIndisponibleFound === null) return null

        await this.db.getRepository(DateIndisponible).delete({id})
        return dateIndisponibleFound
    }
}