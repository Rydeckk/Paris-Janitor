import { DataSource } from "typeorm";
import { Photo } from "../database/entities/photo";

export class PhotoUseCase {
    constructor(private readonly db: DataSource) { }

    async deletePhoto(id: number, logementId: number): Promise <Photo | null> {
        const query = this.db.createQueryBuilder(Photo, "photo")
        query.innerJoin("photo.logement","logement")
        query.andWhere("logement.id = :logementId", {logementId: logementId})
        query.andWhere("photo.id = :photoId", {photoId: id})
        const photoFound = await query.getOne()

        if(photoFound === null) return null

        await this.db.getRepository(Photo).delete({id})
        return photoFound
    }
}