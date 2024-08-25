import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { generatePdfDevis } from "../service/pdf"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { createDevisValidation, getDevisValidation, listDevisValidation } from "./validators/devis-validator"
import { AppDataSource } from "../database/database"
import { Devis } from "../database/entities/devis"
import { getConnectedUser, UserUseCase } from "../domain/user-usecase"
import { DevisUseCase } from "../domain/devis-usecase"
import fs from "fs-extra"

export const DevisHandler = (app: express.Express) => {
    app.post("/devis", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = createDevisValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createDevisRequest = validation.value

        const pathPdf = generatePdfDevis(createDevisRequest)
        const pathSplit = pathPdf.split("/")
        const namePdf = pathSplit[pathSplit.length - 1]

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            const devisCreated = await AppDataSource.getRepository(Devis).save({
                nomDevis: namePdf,
                nomPersonne: userFound.lastName,
                prenom: userFound.firstName,
                montant: createDevisRequest.total,
                user: userFound
            })
            res.status(200).send(devisCreated)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/devisNonConnecte", async (req: Request, res: Response) => {
        const validation = createDevisValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createDevisRequest = validation.value

        const pathPdf = generatePdfDevis(createDevisRequest)
        const pathSplit = pathPdf.split("/")
        const namePdf = pathSplit[pathSplit.length - 1]

        try {
            const devisCreated = await AppDataSource.getRepository(Devis).save({
                nomDevis: namePdf,
                nomPersonne: createDevisRequest.nom,
                prenom: createDevisRequest.prenom,
                montant: createDevisRequest.total
            })
            res.status(200).send(devisCreated)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/devis", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = listDevisValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listDevisRequest = validation.value

        try {
            if(listDevisRequest.userId) {
                const userUseCase = new UserUseCase(AppDataSource)
                const userFound = await userUseCase.getUser(listDevisRequest.userId)
                const devisUseCase = new DevisUseCase(AppDataSource)
                if(!userFound) {
                    res.status(404).send({error: `User ${listDevisRequest.userId} not found`})
                    return
                }
                const listDevis = await devisUseCase.getListDevis({user: userFound})
                res.status(200).send(listDevis)
            } else {
                const devisUseCase = new DevisUseCase(AppDataSource)
                const listDevis = await devisUseCase.getListDevis({})
                res.status(200).send(listDevis)
            }
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }

    })

    app.get("/myDevis", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = listDevisValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listDevisRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const devisUseCase = new DevisUseCase(AppDataSource)
            const listDevis = await devisUseCase.getListDevis({user: userFound})
            res.status(200).send(listDevis)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }

    })

    app.get("/devis/:id/download", authMiddlewareOwner, async (req:Request, res: Response) => {
        const validation = getDevisValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const devisRequest = validation.value
        const userFound = await getConnectedUser(req.user.userId, AppDataSource)
        if(userFound === null) {
            res.status(404).send({error: "User not found"})
            return
        }

        const devisUseCase = new DevisUseCase(AppDataSource)
        const devisFound = await devisUseCase.getDevis(devisRequest.id)
        if (devisFound === null) {
            res.status(404).send({error: `Devis ${devisRequest.id} not found`})
            return
        }

        const pathFile = "uploads/devis/" + devisFound.nomDevis

        if (fs.existsSync(pathFile)) {
            res.download(pathFile, (err) => {
              if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({
                  message: 'Error downloading file',
                  error: err.message,
                });
              } else {
                console.log('File downloaded successfully:', devisFound.nomDevis);
              }
            });
          } else {
            res.status(404).json({ message: 'File not found' })
          }
    })
}