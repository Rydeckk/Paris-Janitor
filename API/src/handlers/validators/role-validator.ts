import Joi from "joi"

export interface GetRoleByIdRequest {
    id: number
}

export const getRoleByIdValidation = Joi.object<GetRoleByIdRequest>({
    id: Joi.number().required()
})

export interface GetRolesRequest {
    page?: number,
    limit?: number,
    isOwner?: boolean,
    isAdmin?: boolean
}

export const getRolesValidation = Joi.object<GetRolesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isOwner: Joi.bool()
        .optional(),
    isAdmin: Joi.bool()
        .optional()
})

export interface UpdateRoleRequest {
    id: number,
    name?: string,
    isOwner?: boolean,
    isAdmin?: boolean
}

export const updateRoleValidation = Joi.object<UpdateRoleRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .min(3)
        .optional(),
    isOwner: Joi.bool()
        .optional(),
    isAdmin: Joi.bool()
        .optional()
})

