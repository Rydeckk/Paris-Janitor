import Joi, { object } from "joi";

interface CreateAbonnementRequest {
    nom: string,
    montant: number
}

export const createAbonnementValidation = Joi.object<CreateAbonnementRequest>({
    nom: Joi.string().required(),
    montant: Joi.number().min(1).required()
})

interface GetAbonnementRequest {
    id: number
}

export const getAbonnementValidation = Joi.object<GetAbonnementRequest>({
    id: Joi.number().required()
})

interface UpdateAbonnementRequest {
    id: number,
    nom?: string,
    montant?: number
}

export const updateAbonnementValidation = Joi.object<UpdateAbonnementRequest>({
    id: Joi.number().required(),
    nom: Joi.string().optional(),
    montant: Joi.number().optional()
})

interface SouscriptionRequest {
    id: number
}

export const souscriptionValidation = Joi.object<SouscriptionRequest>({
    id: Joi.number().required()
})