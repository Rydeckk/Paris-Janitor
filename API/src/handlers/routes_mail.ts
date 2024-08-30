import express, { Response } from "express"
import { Request } from "../types/express"
import { sendMailDevisValidation, sendMailFactureValidation } from "./validators/mail-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { bodyMailDevis, bodyMailFacture, bodyMailFactureReservation, sendEmail } from "../service/mail"
import { generatePdfDevis } from "../service/pdf"
import { DevisUseCase } from "../domain/devis-usecase"
import { AppDataSource } from "../database/database"
import { authMiddleware } from "./middleware/auth_middleware"
import { FactureUseCase } from "../domain/facture-usecase"
import { getConnectedUser } from "../domain/user-usecase"

export const MailHandler = (app: express.Express) => {
    app.post("/mail/devis", async (req: Request, res: Response) => {
        const validation = sendMailDevisValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const sendMailDevisRequest = validation.value

        const devisUseCase = new DevisUseCase(AppDataSource)
        const devisFound = await devisUseCase.getDevis(sendMailDevisRequest.devisId)

        if(!devisFound) {
            res.status(404).send({error: `Devis ${sendMailDevisRequest.devisId} not found`})
            return
        }

        try {
            if(process.env.EMAIL_NAME) {
                sendEmail({
                    to: sendMailDevisRequest.email,
                    from: process.env.EMAIL_NAME,
                    subject: "Devis de votre logement sur Paris Janitor",
                    text: bodyMailDevis(devisFound.nomPersonne, devisFound.prenom),
                    attachments: [{filename: devisFound.nomDevis, path: "uploads/devis/"+devisFound.nomDevis}]
                })

                res.status(200).send({message: "Email envoyé"})
            }
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/mail/factureReservation", authMiddleware, async (req: Request, res: Response) => {
        const validation = sendMailFactureValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const sendMailFactureRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const factureUseCase = new FactureUseCase(AppDataSource)
        const factureFound = await factureUseCase.getFacture(sendMailFactureRequest.factureId)

        if(!factureFound) {
            res.status(404).send({error: `Facture ${sendMailFactureRequest.factureId} not found`})
            return
        }

        try {
            if(process.env.EMAIL_NAME) {
                sendEmail({
                    to: userFound.email,
                    from: process.env.EMAIL_NAME,
                    subject: "Facture de votre réservation sur Paris Janitor",
                    text: bodyMailFactureReservation(),
                    attachments: [{filename: factureFound.nomFacture, path: "uploads/factures/"+factureFound.nomFacture}]
                })

                res.status(200).send({message: "Email envoyé"})
            }
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/mail/facture", authMiddleware, async (req: Request, res: Response) => {
        const validation = sendMailFactureValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const sendMailFactureRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const factureUseCase = new FactureUseCase(AppDataSource)
        const factureFound = await factureUseCase.getFacture(sendMailFactureRequest.factureId)

        if(!factureFound) {
            res.status(404).send({error: `Facture ${sendMailFactureRequest.factureId} not found`})
            return
        }

        try {
            if(process.env.EMAIL_NAME) {
                sendEmail({
                    to: userFound.email,
                    from: process.env.EMAIL_NAME,
                    subject: "Facture de votre abonnement sur Paris Janitor",
                    text: bodyMailFacture(),
                    attachments: [{filename: factureFound.nomFacture, path: "uploads/factures/"+factureFound.nomFacture}]
                })

                res.status(200).send({message: "Email envoyé"})
            }
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })
}