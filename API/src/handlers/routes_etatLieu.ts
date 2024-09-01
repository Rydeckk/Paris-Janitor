import express, { Response } from "express"
import { Request } from "../types/express"
import { AppDataSource } from "../database/database"
import fs from "fs-extra"
import { createEtatLieuValidation, getEtatLieuValidation, listEtatLieuValidation } from "./validators/etatLieu-validator"
import { authMiddleware, authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { EtatLieuUseCase } from "../domain/etatLieu-usecase"
import { getConnectedUser, UserUseCase } from "../domain/user-usecase"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { EtatLieu } from "../database/entities/etatLieu"
import { generatePdfEtatLieu } from "../service/pdf"
import { ReservationUseCase } from "../domain/reservation-usecase"
import { Reservation } from "../database/entities/reservation"
import { EtatEquipement } from "../database/entities/etatEquipement"

export const EtatLieuHandler = (app: express.Express) => {
    app.get("/etatLieu/:id/download", authMiddleware, async (req:Request, res: Response) => {
        const validation = getEtatLieuValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const etatLieuRequest = validation.value
        const userFound = await getConnectedUser(req.user.userId, AppDataSource)
        if(userFound === null) {
            res.status(404).send({error: "User not found"})
            return
        }

        const etatLieuUseCase = new EtatLieuUseCase(AppDataSource)
        const etatLieuFound = await etatLieuUseCase.getEtatLieu(etatLieuRequest.id)
        if (etatLieuFound === null) {
            res.status(404).send({error: `EtatLieu ${etatLieuRequest.id} not found`})
            return
        }

        const pathFile = "uploads/etatLieux/" + etatLieuFound.nomEtatLieu

        if (fs.existsSync(pathFile)) {
            res.download(pathFile, (err) => {
              if (err) {
                console.error('Error downloading file:', err);
                res.status(500).json({
                  message: 'Error downloading file',
                  error: err.message,
                });
              } else {
                console.log('File downloaded successfully:', etatLieuFound.nomEtatLieu);
              }
            });
          } else {
            res.status(404).json({ message: 'File not found' })
          }
    })

    app.get("/etatLieu", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = listEtatLieuValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listEtatLieuRequest = validation.value

        try {

            const etatLieuUseCase = new EtatLieuUseCase(AppDataSource)
            const listEtatLieu = await etatLieuUseCase.getListEtatLieu(listEtatLieuRequest)
            res.status(200).send(listEtatLieu.etatLieux)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }

    })

    app.get("/logement/:logementId/etatLieu", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = listEtatLieuValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listEtatLieuRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const etatLieuUseCase = new EtatLieuUseCase(AppDataSource)
            const listEtatLieu = await etatLieuUseCase.getListEtatLieu({logementId: listEtatLieuRequest.logementId})
            res.status(200).send(listEtatLieu.etatLieux)
            
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }

    })

    app.post("/reservation/:reservationId/etatLieu", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = createEtatLieuValidation.validate({...req.body, ...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createEtatLieuRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const reservationUseCase = new ReservationUseCase(AppDataSource)
        const reservationFound = await reservationUseCase.getReservation(createEtatLieuRequest.reservationId)

        if (!reservationFound) {
            res.status(404).send({error: `Réservation ${createEtatLieuRequest.reservationId} not found`})
            return
        }

        const pathPdf = generatePdfEtatLieu(createEtatLieuRequest, userFound, reservationFound)
        const pathSplit = pathPdf.split("/")
        const namePdf = pathSplit[pathSplit.length - 1]

        try {
            let etatLieuCreated: EtatLieu | null = null

            if(createEtatLieuRequest.type === "entree") {
                etatLieuCreated = await AppDataSource.getRepository(EtatLieu).save({
                    nomEtatLieu: namePdf,
                    nom: userFound.lastName,
                    prenom: userFound.firstName,
                    etatEquipements: createEtatLieuRequest.etatsEquipements,
                    reservationEntree: reservationFound
                })
            } else {
                etatLieuCreated = await AppDataSource.getRepository(EtatLieu).save({
                    nomEtatLieu: namePdf,
                    nom: userFound.lastName,
                    prenom: userFound.firstName,
                    etatEquipements: createEtatLieuRequest.etatsEquipements,
                    reservationSortie: reservationFound
                })
            }

            const listeEtatEquip = createEtatLieuRequest.etatsEquipements.map((equip) => ({...equip,etatLieu: etatLieuCreated}))
            const listEtatEquipementCreated = await AppDataSource.getRepository(EtatEquipement).save(listeEtatEquip)

            res.status(200).send(etatLieuCreated)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })
}