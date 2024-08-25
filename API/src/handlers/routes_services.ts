import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddleware, authMiddlewareAdmin, authMiddlewareOwner } from "./middleware/auth_middleware"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { AppDataSource } from "../database/database"
import { createServiceValidation, getListServiceValidation, getServiceValidation, updateServiceValidation } from "./validators/service-validator"
import { Service } from "../database/entities/service"
import { ServiceUseCase } from "../domain/service-usecase"

export const ServiceHandler = (app: express.Express) => {
    app.post("/service", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = createServiceValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createServiceRequest = validation.value

        try {
            
            const serviceCreated = await AppDataSource.getRepository(Service).save(createServiceRequest)

            res.status(200).send(serviceCreated)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/service", authMiddleware, async (req: Request, res: Response) => {
        const validation = getListServiceValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListServiceRequest = validation.value

        try {
            const serviceUseCase = new ServiceUseCase(AppDataSource)
            const listServices = await serviceUseCase.listService(getListServiceRequest)

            res.status(200).send(listServices)
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/serviceOwner", async (req: Request, res: Response) => {
        const validation = getListServiceValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListServiceRequest = validation.value

        try {
            const serviceUseCase = new ServiceUseCase(AppDataSource)
            const listServices = await serviceUseCase.listService({...getListServiceRequest, type: "owner"})

            res.status(200).send(listServices)
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.patch("/service/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = updateServiceValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateServiceRequest = validation.value

        try {
            const serviceUseCase = new ServiceUseCase(AppDataSource)
            const updatedService = await serviceUseCase.updateService(updateServiceRequest.id, {...updateServiceRequest})
            if(updatedService === null) {
                res.status(404).send({error: `Service ${updateServiceRequest.id} not found`})
                return
            }

            res.status(200).send(updatedService)
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.delete("/service/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = getServiceValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteServiceRequest = validation.value

        try {
            const serviceUseCase = new ServiceUseCase(AppDataSource)
            const deletedService = await serviceUseCase.deleteService(deleteServiceRequest.id)
            if(deletedService === null) {
                res.status(404).send({error: `Service ${deleteServiceRequest.id} not found`})
                return
            }

            res.status(200).send(deletedService)
        } catch (error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
}