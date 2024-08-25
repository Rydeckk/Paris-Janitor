import { DataSource } from "typeorm";
import { Reservation } from "../database/entities/reservation";

// interface UpdateReservationParams {
//     nom?: string,
//     typeLocation?: TypeLocation
//     nbChambres?: number
//     capacite?: number
//     surface?: number
//     prixNuit?: number
// }

interface FiltersReservation {
    logementId?: number,
    userId?: number
}

export class ReservationUseCase {
    constructor(private readonly db: DataSource) { }

    async listReservation(filters: FiltersReservation): Promise<{reservations: Reservation[]}> {
        const query = this.db.createQueryBuilder(Reservation, 'reservation')
        query.innerJoinAndSelect("reservation.user","user")
        query.innerJoinAndSelect("reservation.logement", "logement")
        query.leftJoinAndSelect("reservation.services", "service")

        if(filters.logementId !== undefined) {
            query.andWhere("logement.id = :logementId", {logementId: filters.logementId})
        }

        if(filters.userId !== undefined) {
            query.andWhere("user.id = :userId", {userId: filters.userId})
        }

        const reservations = await query.getMany()
        return {
            reservations
        }
    }

    async getReservation(id: number, userId?: number): Promise <Reservation | null> {
        const query = this.db.createQueryBuilder(Reservation,"reservation")
        query.innerJoinAndSelect("reservation.user","user")
        query.leftJoinAndSelect("reservation.logement","photo")
        query.leftJoinAndSelect("reservation.services","service")
        query.where("reservation.id = :reservationId", {reservationId: id})

        if(userId) {
            query.andWhere("user.id = :userId",{userId: userId})
        }

        const reservationFound = await query.getOne()
        if(reservationFound === null) return null

        return reservationFound
    }

    async deleteReservation(id: number): Promise <Reservation | null> {
        const reservationRepo = this.db.getRepository(Reservation)
        const reservationFound = await reservationRepo.findOne({where: {id: id}})
        if (reservationFound === null) return null

        await reservationRepo.delete({id})
        return reservationFound
    }

}