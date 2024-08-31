import { DataSource } from "typeorm";
import { Operation } from "../database/entities/operation";

interface ListFilter {
    userId?: number
}

export class OperationUseCase {
    constructor(private readonly db: DataSource) { }

    async getListOperation(filter: ListFilter): Promise<{operations: Operation[]}> {
        const query = this.db.createQueryBuilder(Operation, "ope")
        
        if(filter.userId) {
            query.innerJoinAndSelect("ope.user","user")
            query.where("user.id = :userId", {userId: filter.userId})
        } else {
            query.leftJoinAndSelect("ope.user","user")
            query.where("user.id IS NULL")
        }

        const operations = await query.getMany()
        return {
            operations
        }
    }
}