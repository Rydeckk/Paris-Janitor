import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware, authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { createFactureValidation, getFactureValidation, listFactureValidation } from "./validators/facture-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { getConnectedUser, UserUseCase } from "../domain/user-usecase"
import { AppDataSource } from "../database/database"
import fs from "fs-extra"
import { FactureUseCase } from "../domain/facture-usecase"

export const FactureHandler = (app: express.Express) => {
    app.get("/facture/:id/download", authMiddleware, async (req:Request, res: Response) => {
        const validation = getFactureValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const factureRequest = validation.value
        const userFound = await getConnectedUser(req.user.userId, AppDataSource)
        if(userFound === null) {
            res.status(404).send({error: "User not found"})
            return
        }

        const factureUseCase = new FactureUseCase(AppDataSource)
        const factureFound = await factureUseCase.getFacture(factureRequest.id)
        if (factureFound === null) {
            res.status(404).send({error: `Facture ${factureRequest.id} not found`})
            return
        }

        const pathFile = "uploads/factures/" + factureFound.nomFacture

        if (fs.existsSync(pathFile)) {
            res.download(pathFile, (err) => {
              if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({
                  message: 'Error downloading file',
                  error: err.message,
                });
              } else {
                console.log('File downloaded successfully:', factureFound.nomFacture);
              }
            });
          } else {
            res.status(404).json({ message: 'File not found' })
          }
    })

    app.get("/facture", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = listFactureValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listFactureRequest = validation.value

        try {
            if(listFactureRequest.userId) {
                const userUseCase = new UserUseCase(AppDataSource)
                const userFound = await userUseCase.getUser(listFactureRequest.userId)
                const factureUseCase = new FactureUseCase(AppDataSource)
                if(!userFound) {
                    res.status(404).send({error: `User ${listFactureRequest.userId} not found`})
                    return
                }
                const listFacture = await factureUseCase.getListFacture({user: userFound})
                res.status(200).send(listFacture)
            } else {
                const factureUseCase = new FactureUseCase(AppDataSource)
                const listFacture = await factureUseCase.getListFacture({})
                res.status(200).send(listFacture)
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }

    })

    app.get("/myFacture", authMiddlewareOwner, async (req: Request, res: Response) => {
        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const factureUseCase = new FactureUseCase(AppDataSource)
            const listFacture = await factureUseCase.getListFacture({user: userFound})
            res.status(200).send(listFacture)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }

    })
}