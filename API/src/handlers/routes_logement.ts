import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware, authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { createLogementValidation, getListLogementValidation, getLogementValidation, serviceLogementValidation, updateLogementValidation, updateStatutLogementValidation } from "./validators/logement-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { AppDataSource } from "../database/database"
import { Logement } from "../database/entities/logement"
import { LogementUseCase } from "../domain/logement-usecase"
import { getConnectedUser } from "../domain/user-usecase"
import { Service } from "../database/entities/service"
import { createDateIndisponibleValidation, deleteDateIndisponibleValidation } from "./validators/dateIndisponible-validator"
import { DateIndisponible } from "../database/entities/dateIndisponible"
import { DateIndisponibleUseCase } from "../domain/dateIndisponible-usecase"

export const LogementHandler = (app: express.Express) => {
    app.post("/logement", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = createLogementValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createLogementRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const logementCreated = await AppDataSource.getRepository(Logement).save({...createLogementRequest, user: userFound})

            res.status(200).send(logementCreated)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/logement", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = getListLogementValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listLogementRequest = validation.value

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const listLogement = await logementUseCase.listLogement({...listLogementRequest})
            listLogement.logements.forEach((logement) => logement.photos = logement.photos.sort((a,b) => a.id - b.id))
            res.status(200).send(listLogement)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/myLogement", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = getListLogementValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listLogementRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const listLogement = await logementUseCase.listLogement({...listLogementRequest, userId: userFound?.id})
            listLogement.logements.forEach((logement) => logement.photos = logement.photos.sort((a,b) => a.id - b.id))
            res.status(200).send(listLogement)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/logementValide", authMiddleware, async (req: Request, res: Response) => {
        const validation = getListLogementValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listLogementRequest = validation.value

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const listLogement = await logementUseCase.listLogement({...listLogementRequest,statut: "valide"})
            listLogement.logements.forEach((logement) => logement.photos = logement.photos.sort((a,b) => a.id - b.id))
            res.status(200).send(listLogement)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/logement/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = getLogementValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getLogementRequest = validation.value

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const logementFound = await logementUseCase.getLogement(getLogementRequest.id)
            if(!logementFound) {
                res.status(404).send({error: `Logement ${getLogementRequest.id} not found`})
                return
            }
            res.status(200).send(logementFound)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.patch("/logement/:id/statut", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = updateStatutLogementValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const logementRequest = validation.value

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const updatedLogement = await logementUseCase.updateStatutLogement(logementRequest.id,logementRequest.statut)
            if(!updatedLogement) {
                res.status(404).send({error: `Logement ${logementRequest.id} not found`})
                return
            }
            res.status(200).send(updatedLogement)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.patch("/logement/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = updateLogementValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateLogementRequest = validation.value

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const updatedLogement = await logementUseCase.updateLogement(updateLogementRequest.id,{...updateLogementRequest})
            if(!updatedLogement) {
                res.status(404).send({error: `Logement ${updateLogementRequest.id} not found`})
                return
            }
            res.status(200).send(updatedLogement)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/logement/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = getLogementValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteLogementRequest = validation.value

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const deletedLogement = await logementUseCase.deleteLogement(deleteLogementRequest.id)
            if(!deletedLogement) {
                res.status(404).send({error: `Logement ${deleteLogementRequest.id} not found`})
                return
            }
            res.status(200).send(deletedLogement)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/logement/:logementId/service/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = serviceLogementValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const addServiceLogementRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        const serviceFound = await AppDataSource.getRepository(Service).findOne({where: {id: addServiceLogementRequest.id}, relations: ["logements"]})
        if(serviceFound === null) {
            res.status(404).send({error: `Service ${addServiceLogementRequest.id} not found`})
            return
        }

        if(serviceFound.logements.filter((logement) => logement.id === addServiceLogementRequest.logementId).length > 0) {
            return
        }

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const logementFound = await logementUseCase.getLogement(addServiceLogementRequest.logementId, userFound?.id)
            if(logementFound === null) {
                res.status(404).send({error: `Logement ${addServiceLogementRequest.logementId} not found`})
                return
            }
            logementFound.services.push(serviceFound)
            const updatedLogement = await AppDataSource.getRepository(Logement).save(logementFound)
            res.status(201).send(updatedLogement)

        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/logement/:logementId/service/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = serviceLogementValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const removeServiceLogementRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        const serviceFound = await AppDataSource.getRepository(Service).findOne({where: {id: removeServiceLogementRequest.id}, relations: ["logements"]})
        if(serviceFound === null) {
            res.status(404).send({error: `Service ${removeServiceLogementRequest.id} not found`})
            return
        }

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const logementFound = await logementUseCase.getLogement(removeServiceLogementRequest.logementId, userFound?.id)
            if(logementFound === null) {
                res.status(404).send({error: `Logement ${removeServiceLogementRequest.logementId} not found`})
                return
            }
            logementFound.services = logementFound.services.filter((service) => service.id !== removeServiceLogementRequest.id)
            const updatedLogement = await AppDataSource.getRepository(Logement).save(logementFound)
            res.status(201).send(updatedLogement)

        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/logement/:logementId/date", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = createDateIndisponibleValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createDateIndisponibleRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const logementFound = await logementUseCase.getLogement(createDateIndisponibleRequest.logementId, userFound?.id)
            if(logementFound === null) {
                res.status(404).send({error: `Logement ${createDateIndisponibleRequest.logementId} not found`})
                return
            }

            const datesIndisponibles = createDateIndisponibleRequest.date.map((date) => {
                return {date: date, logement: logementFound}
            })

            const dateIndisponibleCreated = await AppDataSource.getRepository(DateIndisponible).save(datesIndisponibles)

            const updatedLogement = await logementUseCase.getLogement(createDateIndisponibleRequest.logementId, userFound?.id)
            res.status(201).send(updatedLogement)

        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/logement/:logementId/date/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = deleteDateIndisponibleValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteDateIndisponibleRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        try {
            
            const logementUseCase = new LogementUseCase(AppDataSource)
            const logementFound = await logementUseCase.getLogement(deleteDateIndisponibleRequest.logementId, userFound?.id)
            if(logementFound === null) {
                res.status(404).send({error: `Logement ${deleteDateIndisponibleRequest.logementId} not found`})
                return
            }

            const dateIndisponibleUseCase = new DateIndisponibleUseCase(AppDataSource)
            const dateIndisponibleDelete = await dateIndisponibleUseCase.deleteDateIndisponible(deleteDateIndisponibleRequest.id)

            if(!dateIndisponibleDelete) {
                res.status(404).send({error: `Date ${deleteDateIndisponibleRequest.id} not found`})
                return
            }

            logementFound.datesIndisponibles = logementFound.datesIndisponibles.filter((datesIndisponibles) => datesIndisponibles.id !== deleteDateIndisponibleRequest.id)
            const updatedLogement = await AppDataSource.getRepository(Logement).save(logementFound)
            res.status(201).send(updatedLogement)

        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
}