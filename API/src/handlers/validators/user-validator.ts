import Joi from "joi";
import { TypeUser } from "../../types/types"

export const createUserValidation = Joi.object<CreateUserValidationRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    type: Joi.string().valid("traveler","owner","admin").required()
}).options({ abortEarly: false });

export interface CreateUserValidationRequest {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    type: TypeUser
}

export const LoginUserValidation = Joi.object<LoginUserValidationRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string().valid("traveler","owner","admin").required()
}).options({ abortEarly: false });

export interface LoginUserValidationRequest {
    email: string
    password: string,
    type: TypeUser
}

export interface GetUsersRequest {
    page?: number
    limit?: number,
    isOwner?: boolean,
    isAdmin?: boolean,
    isBan?: boolean
}

export const getUsersValidation = Joi.object<GetUsersRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isOwner: Joi.bool().optional(),
    isAdmin: Joi.bool().optional(),
    isBan: Joi.bool().optional()
})

export interface GetUserByIdRequest {
    id: number  
}

export const getUserByIdValidation = Joi.object<GetUserByIdRequest>({
    id: Joi.number().required()
})


export interface UpdateUserRequest {
    id: number,
    password?: string,
    roleId?: number
}

export const updateUserValidation = Joi.object<UpdateUserRequest>({
    id: Joi.number().required(),
    password: Joi.string().optional(),
    roleId: Joi.number().optional()
})

export interface GetMyUsersRequest {
    page?: number
    limit?: number,
    isOwner?: boolean,
    isAdmin?: boolean
}

export const getMyUsersValidation = Joi.object<GetMyUsersRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isOwner: Joi.bool().optional(),
    isAdmin: Joi.bool().optional()
})

export interface GetMyUserByIdRequest {
    id: number  
}

export const getMyUserByIdValidation = Joi.object<GetMyUserByIdRequest>({
    id: Joi.number().required()
})


export interface UpdateMyUserRequest {
    id: number,
    roleId?: number
}

export const updateMyUserValidation = Joi.object<UpdateMyUserRequest>({
    id: Joi.number().required(),
    roleId: Joi.number().optional()
})

export interface UpdateMyInfoUserRequest {
    email?: string,
    firstName?: string,
    lastName?: string,
    phone?: string
}

export const updateMyInfoUserValidation = Joi.object<UpdateMyInfoUserRequest>({
    email: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phone: Joi.string().optional()
})