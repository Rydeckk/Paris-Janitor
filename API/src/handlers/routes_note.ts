import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware } from "./middleware/auth_middleware"
import { createNoteValidation, getListNoteValidation, getNoteValidation, updateNoteValidation } from "./validators/note-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { NoteUseCase } from "../domain/note-usecase"
import { AppDataSource } from "../database/database"
import { ServiceUseCase } from "../domain/service-usecase"
import { Note } from "../database/entities/note"
import { getConnectedUser } from "../domain/user-usecase"

export const NoteHandler = (app: express.Express) => {
    app.get("/service/:serviceId/note", authMiddleware, async (req: Request, res: Response) => {
        const validation = getListNoteValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listNoteRequest = validation.value

        try {
            const noteUseCase = new NoteUseCase(AppDataSource)
            const listeNote = await noteUseCase.getListNote(listNoteRequest)
            res.status(200).send(listeNote.notes)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.post("/service/:serviceId/note", authMiddleware, async (req: Request, res: Response) => {
        const validation = createNoteValidation.validate({...req.params,...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createNoteRequest = validation.value

        const serviceUseCase = new ServiceUseCase(AppDataSource)
        const serviceFound = await serviceUseCase.getService(createNoteRequest.serviceId)

        if(!serviceFound) {
            res.status(404).send({error: `Service ${createNoteRequest.serviceId} not found`})
            return
        }

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            
            const noteCreated = await AppDataSource.getRepository(Note).save({...createNoteRequest, user: userFound, service: serviceFound})
            res.status(200).send(noteCreated)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.patch("/note/:id", authMiddleware, async (req: Request, res: Response) => {
        const validation = updateNoteValidation.validate({...req.params,...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateNoteRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            const noteUseCase = new NoteUseCase(AppDataSource)
            const updatedNote = await noteUseCase.updateNote(updateNoteRequest.id, {...updateNoteRequest}, userFound)
            if(!updatedNote) {
                res.status(404).send({error: `Note ${updateNoteRequest.id} not found`})
                return
            }
            res.status(200).send(updatedNote)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/note/:id", authMiddleware, async (req: Request, res: Response) => {
        const validation = getNoteValidation.validate(req.params)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteNoteRequest = validation.value

        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)

        if (!userFound) {
            res.status(404).send({error: `User ${userId} not found`})
            return
        }

        try {
            const noteUseCase = new NoteUseCase(AppDataSource)
            const deletedNote = await noteUseCase.deleteNote(deleteNoteRequest.id, userFound)
            if(!deletedNote) {
                res.status(404).send({error: `Note ${deleteNoteRequest.id} not found`})
                return
            }
            res.status(200).send(deletedNote)
        }
        catch(err) {
            console.log(err)
            res.status(500).send({error: "Internal error"})
        }
    })
}