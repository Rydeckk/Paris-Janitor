import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddlewareAdmin } from "./middleware/auth_middleware"
import { AppDataSource } from "../database/database"
import { RoleUseCase } from "../domain/role-usecase"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { getRoleByIdValidation, getRolesValidation, updateRoleValidation } from "./validators/role-validator"

export const RoleHandler = (app: express.Express) => {
    app.get("/role/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = getRoleByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoleRequest = validation.value

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const selectedRole = await roleUseCase.getRole(getRoleRequest.id)
            if (selectedRole === null) {
                res.status(404).send({"error": `Role ${getRoleRequest.id} not found`})
                return
            }
            res.status(200).send(selectedRole)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    app.get("/role", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getRolesValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listRolesRequest = validation.value
        let limit = 20
        if (listRolesRequest.limit) {
            limit = listRolesRequest.limit
        }
        const page = listRolesRequest.page ?? 1

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const selectedRole = await roleUseCase.getListRole({ ...listRolesRequest, page, limit })
            res.status(200).send(selectedRole)
        }catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/role/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {

        const validation = updateRoleValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateRoleRequest = validation.value

        try {
            const roleUsecase = new RoleUseCase(AppDataSource);
            const updatedRole = await roleUsecase.updateRole(updateRoleRequest.id, { ...updateRoleRequest })
            if (updatedRole === null) {
                res.status(404).send({"error": `Role ${updateRoleRequest.id} not found`})
                return
            }
            res.status(200).send(updatedRole)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/role/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getRoleByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoleRequest = validation.value

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const deletedRole = await roleUseCase.deleteRole(getRoleRequest.id)
            if (deletedRole === null) {
                res.status(404).send({"error": `Role ${getRoleRequest.id} not found`})
                return
            }
            res.status(200).send(`Role deleted : ${deletedRole.name}`)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

}