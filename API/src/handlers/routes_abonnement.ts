import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { createAbonnementValidation, getAbonnementValidation, souscriptionValidation, updateAbonnementValidation } from "./validators/abonnement-validator"
import { AppDataSource } from "../database/database"
import { Abonnement } from "../database/entities/abonnement"
import { AbonnementUseCase } from "../domain/abonnement-usecase"
import { getConnectedUser } from "../domain/user-usecase"
import { Souscription } from "../database/entities/souscription"
import { LogementUseCase } from "../domain/logement-usecase"
import { Logement } from "../database/entities/logement"
import { SouscriptionUseCase } from "../domain/souscription-usecase"
import { generatePdfFactureSouscription } from "../service/pdf"
import { Facture } from "../database/entities/facture"
import { Operation } from "../database/entities/operation"

export const AbonnementHandler = (app: express.Express) => {
    app.post("/abonnement", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = createAbonnementValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createAbonnementRequest = validation.value

        try {
            const abonnementCreated = await AppDataSource.getRepository(Abonnement).save(createAbonnementRequest)
            res.status(200).send(abonnementCreated)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/abonnement/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = getAbonnementValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getAbonnementRequest = validation.value

        try {
            const abonnementUseCase = new AbonnementUseCase(AppDataSource)
            const abonnementFound = await abonnementUseCase.getAbonnement(getAbonnementRequest.id)
            if(!abonnementFound) {
                res.status(404).send({error: `Abonnement ${getAbonnementRequest.id} not found`})
                return 
            }
            res.status(200).send(abonnementFound)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/abonnement", authMiddlewareAdmin, async (req: Request, res: Response) => {

        try {
            const abonnementUseCase = new AbonnementUseCase(AppDataSource)
            const listAbonnement = await abonnementUseCase.getListAbonnement()
            res.status(200).send(listAbonnement)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.patch("/abonnement/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = updateAbonnementValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateAbonnementRequest = validation.value

        try {
            const abonnementUseCase = new AbonnementUseCase(AppDataSource)
            const abonnementUpdated = await abonnementUseCase.updateAbonnement(updateAbonnementRequest.id, {...updateAbonnementRequest})
            if(!abonnementUpdated) {
                res.status(404).send({error: `Abonnement ${updateAbonnementRequest.id} not found`})
                return 
            }
            res.status(200).send(abonnementUpdated)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/abonnement/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = getAbonnementValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteAbonnementRequest = validation.value

        try {
            const abonnementUseCase = new AbonnementUseCase(AppDataSource)
            const abonnementDeleted = await abonnementUseCase.deleteAbonnement(deleteAbonnementRequest.id)
            if(!abonnementDeleted) {
                res.status(404).send({error: `Abonnement ${deleteAbonnementRequest.id} not found`})
                return 
            }
            res.status(200).send(abonnementDeleted)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/abonnement/:id/souscrire", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = souscriptionValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const souscriptionRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const abonnementUseCase = new AbonnementUseCase(AppDataSource)
        const abonnementFound = await abonnementUseCase.getAbonnement(souscriptionRequest.id)
        if(!abonnementFound) {
            res.status(404).send({error: `Abonnement ${souscriptionRequest.id} not found`})
            return 
        }

        try {
            const souscriptionUseCase = new SouscriptionUseCase(AppDataSource)
            const souscriptionLast = await souscriptionUseCase.getLastSouscription(userFound.id)
            let dateDebut = new Date()
            let dateFin = new Date((dateDebut.getFullYear()+1), dateDebut.getMonth(), dateDebut.getDate())

            if(souscriptionLast) {
                dateDebut = new Date(souscriptionLast.dateFin)
                dateFin = new Date((dateDebut.getFullYear()+1), dateDebut.getMonth(), dateDebut.getDate())
            }

            const souscriptionCreated = await AppDataSource.getRepository(Souscription).save({
                user: userFound, 
                abonnement: abonnementFound, 
                dateDebut: dateDebut,
                dateFin: dateFin,
                montant: abonnementFound.montant
            })

            const souscriptionFound = await AppDataSource.getRepository(Souscription).findOne({where: {id: souscriptionCreated.id}, relations: ["user","abonnement"]})
            if(!souscriptionFound) {
                return
            }

            const today = new Date()

            const facturePath = generatePdfFactureSouscription(souscriptionFound, today.getTime())
            const pathSplit = facturePath.split("/")
            const namePdf = pathSplit[pathSplit.length - 1]

            const factureCreated = await AppDataSource.getRepository(Facture).save({
                nomFacture: namePdf,
                numeroFacture: String(today.getTime()),
                nomPersonne: userFound.lastName,
                prenom: userFound.firstName,
                montant: souscriptionFound.montant,
                user: userFound,
                souscription: souscriptionFound
            })

            const logementUseCase = new LogementUseCase(AppDataSource)
            const listLogement = await logementUseCase.listLogement({userId: userFound.id})

            listLogement.logements.forEach(async (logement) => {
                logement.isActif = true
                await AppDataSource.getRepository(Logement).save(logement)
            })

            const repoOperation = AppDataSource.getRepository(Operation)

            //Opération du bailleur
            await repoOperation.save({
                montant: souscriptionFound.montant,
                type: "paye",
                description: "paiement abonnement",
                user: userFound
            })

            //Opération pour PJ
            await repoOperation.save({
                montant: souscriptionFound.montant,
                type: "gagne",
                description: "paiement abonnement"
            })
            
            const souscriptionFoundWithFacture = await AppDataSource.getRepository(Souscription).findOne({where: {id: souscriptionCreated.id}, relations: ["user","abonnement","facture"]})
            if(!souscriptionFoundWithFacture) {
                return
            }

            res.status(200).send(souscriptionFoundWithFacture)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }

    })
}