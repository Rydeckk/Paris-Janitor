import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { GetListSouscriptionValidation } from "./validators/souscription-validator"
import { AppDataSource } from "../database/database"
import { getConnectedUser } from "../domain/user-usecase"
import { SouscriptionUseCase } from "../domain/souscription-usecase"

export const SouscriptionHandler = (app: express.Express) => {
    app.get("/souscription", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = GetListSouscriptionValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSouscriptions = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            const souscriptionUseCase = new SouscriptionUseCase(AppDataSource)
            const listSouscription = await souscriptionUseCase.getListSouscription(getSouscriptions)
            res.status(200).send(listSouscription)
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/myListSouscription", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = GetListSouscriptionValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSouscriptions = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            const souscriptionUseCase = new SouscriptionUseCase(AppDataSource)
            const listSouscription = await souscriptionUseCase.getListSouscription({...getSouscriptions, userId: userFound.id})
            res.status(200).send(listSouscription)
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/myActualSouscription", authMiddlewareOwner, async (req: Request, res: Response) => {
        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            const souscriptionUseCase = new SouscriptionUseCase(AppDataSource)
            const mySouscription = await souscriptionUseCase.getMyActualSouscription(userFound.id)
            if(!mySouscription) {
                res.status(404).send({error: `Souscription not found`})
                return
            }
            res.status(200).send(mySouscription)
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
}