import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware, authMiddlewareOwner } from "./middleware/auth_middleware"
import { createEquipementValidation, getListEquipementValidation, getEquipementValidation, updateEquipementValidation } from "./validators/equipement-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { EquipementUseCase } from "../domain/equipement-usecase"
import { AppDataSource } from "../database/database"
import { LogementUseCase } from "../domain/logement-usecase"
import { Equipement } from "../database/entities/equipement"
import { getConnectedUser } from "../domain/user-usecase"

export const EquipementHandler = (app: express.Express) => {
    app.get("/logement/:logementId/equipement", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = getListEquipementValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listEquipementRequest = validation.value

        try {
            const equipementUseCase = new EquipementUseCase(AppDataSource)
            const listeEquipement = await equipementUseCase.getListEquipement(listEquipementRequest)
            res.status(200).send(listeEquipement.equipements)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/logement/:logementId/equipement", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = createEquipementValidation.validate({...req.params,...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createEquipementRequest = validation.value

        const logementUseCase = new LogementUseCase(AppDataSource)
        const logementFound = await logementUseCase.getLogement(createEquipementRequest.logementId)

        if(!logementFound) {
            res.status(404).send({error: `Logement ${createEquipementRequest.logementId} not found`})
            return
        }

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const equipementCreated = await AppDataSource.getRepository(Equipement).save({...createEquipementRequest, user: userFound, logement: logementFound})
            res.status(200).send(equipementCreated)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.patch("/equipement/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = updateEquipementValidation.validate({...req.params,...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateEquipementRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const logementUseCase = new LogementUseCase(AppDataSource)
        const logementFound = await logementUseCase.getLogement(updateEquipementRequest.logementId)

        if(!logementFound) {
            res.status(404).send({error: `Logement ${updateEquipementRequest.logementId} not found`})
            return
        }

        try {
            const equipementUseCase = new EquipementUseCase(AppDataSource)
            const updatedEquipement = await equipementUseCase.updateEquipement(updateEquipementRequest.id, {...updateEquipementRequest}, logementFound)
            if(!updatedEquipement) {
                res.status(404).send({error: `Equipement ${updateEquipementRequest.id} not found`})
                return
            }
            res.status(200).send(updatedEquipement)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/equipement/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = getEquipementValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteEquipementRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const logementUseCase = new LogementUseCase(AppDataSource)
        const logementFound = await logementUseCase.getLogement(deleteEquipementRequest.logementId)

        if(!logementFound) {
            res.status(404).send({error: `Logement ${deleteEquipementRequest.logementId} not found`})
            return
        }

        try {
            const equipementUseCase = new EquipementUseCase(AppDataSource)
            const deletedEquipement = await equipementUseCase.deleteEquipement(deleteEquipementRequest.id, logementFound)
            if(!deletedEquipement) {
                res.status(404).send({error: `Equipement ${deleteEquipementRequest.id} not found`})
                return
            }
            res.status(200).send(deletedEquipement)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })
}