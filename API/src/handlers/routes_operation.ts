import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware, authMiddlewareAdmin } from "./middleware/auth_middleware"
import { getListOperationValidation } from "./validators/operation-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { OperationUseCase } from "../domain/operation-usecase"
import { AppDataSource } from "../database/database"
import { getConnectedUser } from "../domain/user-usecase"

export const OperationHandler = (app: express.Express) => {
    app.get("/operationPJ", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = getListOperationValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const operationRequest = validation.value

        try {
            
            const operationUseCase = new OperationUseCase(AppDataSource)
            const listOpe = await operationUseCase.getListOperation(operationRequest)

            res.status(200).send(listOpe.operations)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/operation", authMiddleware, async (req: Request, res: Response) => {
        const validation = getListOperationValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const operationRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const operationUseCase = new OperationUseCase(AppDataSource)
            const listOpe = await operationUseCase.getListOperation({...operationRequest, userId: userFound.id})

            res.status(200).send(listOpe.operations)

        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
}