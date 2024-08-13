import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware, authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { createLogementValidation, getListLogementValidation, getLogementValidation, updateLogementValidation, updateStatutLogementValidation } from "./validators/logement-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { AppDataSource } from "../database/database"
import { Logement } from "../database/entities/logement"
import { LogementUseCase } from "../domain/logement-usecase"
import { getConnectedUser } from "../domain/user-usecase"

export const LogementHandler = (app: express.Express) => {
    app.post("/logement", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = createLogementValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createLogementRequest = validation.value

        try {
            
            const logementCreated = await AppDataSource.getRepository(Logement).save({...createLogementRequest})
            
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
            res.status(200).send(listLogement)

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
}