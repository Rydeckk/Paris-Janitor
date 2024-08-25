import express, { Response } from "express"
import { Request } from "../types/express"
import { sendMailDevisValidation } from "./validators/mail-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { bodyMailDevis, sendEmail } from "../service/mail"
import { generatePdfDevis } from "../service/pdf"
import { DevisUseCase } from "../domain/devis-usecase"
import { AppDataSource } from "../database/database"

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
}