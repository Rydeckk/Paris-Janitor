import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware, authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { AppDataSource } from "../database/database"
import { getConnectedUser } from "../domain/user-usecase"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { createReservationValidation, deleteReservationValidation, getListReservationValidation, serviceReservationValidation } from "./validators/reservation-validator"
import { LogementUseCase } from "../domain/logement-usecase"
import { Reservation } from "../database/entities/reservation"
import { ReservationUseCase } from "../domain/reservation-usecase"
import { Logement } from "../database/entities/logement"
import { Service } from "../database/entities/service"

export const ReservationHandler = (app: express.Express) => { 
    app.post("/logement/:logementId/reservation", authMiddleware, async (req: Request, res: Response) => {
        const validation = createReservationValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createReservationRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const logementUseCase = new LogementUseCase(AppDataSource)
        const logementFound = await logementUseCase.getLogement(createReservationRequest.logementId)

        if (!logementFound) {
            res.status(404).send({error: `Logement ${createReservationRequest.logementId} not found`})
            return
        }

        try {
            const reservationCreated = await AppDataSource.getRepository(Reservation).save({...createReservationRequest, logement: logementFound, user: userFound})
            res.status(200).send(reservationCreated)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/reservation", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = getListReservationValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listReservationRequest = validation.value

        try {
            
            const reservationUseCase = new ReservationUseCase(AppDataSource)
            const listReservation = await reservationUseCase.listReservation({...listReservationRequest})
            res.status(200).send(listReservation)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/myReservation", authMiddleware, async (req: Request, res: Response) => {
        const validation = getListReservationValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listReservationRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const reservationUseCase = new ReservationUseCase(AppDataSource)
            const listReservation = await reservationUseCase.listReservation({...listReservationRequest, userId: userFound.id})
            res.status(200).send(listReservation)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/logement/:logementId/reservation", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = getListReservationValidation.validate({...req.query, ...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listReservationRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        let logementFound: Logement | null = null
        if(listReservationRequest.logementId) {
            const logementUseCase = new LogementUseCase(AppDataSource)
            logementFound = await logementUseCase.getLogement(listReservationRequest.logementId, userFound.id)
    
        }
        
        if (!logementFound) {
            res.status(404).send({error: `Logement ${listReservationRequest.logementId} not found`})
            return
        }

        try {
            
            const reservationUseCase = new ReservationUseCase(AppDataSource)
            const listReservation = await reservationUseCase.listReservation({...listReservationRequest, logementId: logementFound.id})
            res.status(200).send(listReservation)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/reservation/:id", authMiddleware, async (req: Request, res: Response) => {
        const validation = deleteReservationValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteReservationRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const reservationUseCase = new ReservationUseCase(AppDataSource)
            if(userFound.role.isAdmin === true) {
                const deleteReservation = await reservationUseCase.getReservation(deleteReservationRequest.id)
                res.status(200).send(deleteReservation)
            } else {
                const deleteReservation = await reservationUseCase.getReservation(deleteReservationRequest.id, userFound.id)
                res.status(200).send(deleteReservation)
            }

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/reservation/:reservationId/service/:id", authMiddleware, async (req: Request, res: Response) => {
        const validation = serviceReservationValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const addServiceReservationRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        const serviceFound = await AppDataSource.getRepository(Service).findOne({where: {id: addServiceReservationRequest.id}, relations: ["logements","reservations"]})
        if(serviceFound === null) {
            res.status(404).send({error: `Service ${addServiceReservationRequest.id} not found`})
            return
        }

        if(serviceFound.reservations.filter((reservation) => reservation.id === addServiceReservationRequest.reservationId).length > 0) {
            return
        }

        try {
            
            const reservationUseCase = new ReservationUseCase(AppDataSource)
            const reservationFound = await reservationUseCase.getReservation(addServiceReservationRequest.reservationId, userFound?.id)
            if(reservationFound === null) {
                res.status(404).send({error: `Réservation ${addServiceReservationRequest.reservationId} not found`})
                return
            }
            reservationFound.services.push(serviceFound)
            const updatedReservation = await AppDataSource.getRepository(Reservation).save(reservationFound)
            res.status(201).send(updatedReservation)

        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/reservation/:reservationId/service/:id", authMiddleware, async (req: Request, res: Response) => {
        const validation = serviceReservationValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const removeServiceReservationRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        const serviceFound = await AppDataSource.getRepository(Service).findOne({where: {id: removeServiceReservationRequest.id}, relations: ["logements","reservations"]})
        if(serviceFound === null) {
            res.status(404).send({error: `Service ${removeServiceReservationRequest.id} not found`})
            return
        }

        try {
            
            const reservationUseCase = new ReservationUseCase(AppDataSource)
            const reservationFound = await reservationUseCase.getReservation(removeServiceReservationRequest.reservationId, userFound?.id)
            if(reservationFound === null) {
                res.status(404).send({error: `Réservation ${removeServiceReservationRequest.reservationId} not found`})
                return
            }
            reservationFound.services = reservationFound.services.filter((service) => service.id !== removeServiceReservationRequest.id)
            const updatedReservation = await AppDataSource.getRepository(Logement).save(reservationFound)
            res.status(201).send(updatedReservation)

        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
}

