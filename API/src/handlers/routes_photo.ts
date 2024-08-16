import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddlewareOwner } from "./middleware/auth_middleware"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { AppDataSource } from "../database/database"
import { createPhotoValidation, deletePhotoValidation } from "./validators/photo-validators"
import { getConnectedUser } from "../domain/user-usecase"
import { Photo } from "../database/entities/photo"
import { LogementUseCase } from "../domain/logement-usecase"
import { PhotoUseCase } from "../domain/photo-usecase"

export const PhotoHandler = (app: express.Express) => {
    app.post("/logement/:logementId/photo", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = createPhotoValidation.validate({...req.params,...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createPhotoRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const logementUseCase = new LogementUseCase(AppDataSource)
        const logementFound = await logementUseCase.getLogement(createPhotoRequest.logementId, userFound.id)
        if(!logementFound) {
            res.status(404).send({error: `Logement ${createPhotoRequest.logementId} not found`})
            return
        }

        try {
            
            const photoCreated = await AppDataSource.getRepository(Photo).save({...createPhotoRequest, logement: logementFound, path: "/public/images/" + logementFound.id + "/" + createPhotoRequest.name})
            
            //TODO 
            //Télécharger l'image envoyé
            res.status(200).send(photoCreated)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }

    })

    app.delete("/logement/:logementId/photo/:id", authMiddlewareOwner, async (req: Request, res: Response) => {
        const validation = deletePhotoValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deletePhotoRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        const logementUseCase = new LogementUseCase(AppDataSource)
        const logementFound = await logementUseCase.getLogement(deletePhotoRequest.logementId, userFound.id)
        if(!logementFound) {
            res.status(404).send({error: `Logement ${deletePhotoRequest.logementId} not found`})
            return
        }

        try {
            const photoUseCase = new PhotoUseCase(AppDataSource)
            const photoDeleted = await photoUseCase.deletePhoto(deletePhotoRequest.id, logementFound.id)
            //TODO
            //Supprimer image dans dossier
            if(photoDeleted === null) {
                res.status(404).send({error: `Photo ${deletePhotoRequest.id} not found`})
                return
            }
            res.status(200).send(photoDeleted)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
}