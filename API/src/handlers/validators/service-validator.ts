import Joi from "joi"
import { TypeService } from "../../types/types"

interface CreateServiceRequest {
    nom: string,
    type: TypeService,
    prix: number
}

export const createServiceValidation = Joi.object<CreateServiceRequest>({
    nom: Joi.string().required(),
    type: Joi.string().valid("traveler","owner").required(),
    prix: Joi.number().min(1).required()
})

interface UpdateServiceRequest {
    id: number,
    nom?: string,
    type?: TypeService,
    prix?: number
}

export const updateServiceValidation = Joi.object<UpdateServiceRequest>({
    id: Joi.number().min(0).required(),
    nom: Joi.string().optional(),
    type: Joi.string().valid("traveler","owner").optional(),
    prix: Joi.number().min(1).optional()
})

interface GetServiceRequest {
    id: number
}

export const getServiceValidation = Joi.object<GetServiceRequest>({
    id: Joi.number().min(0).required()
})

interface GetListService {
    type?: TypeService
}

export const getListServiceValidation = Joi.object<GetListService>({
    type: Joi.string().valid("traveler","owner").optional()
}) 