import Joi from "joi"
import { StatutLogement, TypeBien, TypeLocation } from "../../types/express"

interface CreateLogementRequest {
    adresse: string
    typeLogement: TypeBien
    typeLocation: TypeLocation
    nbChambres: number
    capacite: number
    surface: number
    prixNuit: number
    imageSource?: string
}

export const createLogementValidation = Joi.object<CreateLogementRequest>({
    adresse: Joi.string().required(),
    typeLogement: Joi.string().allow("maison","appartement").required(),
    typeLocation: Joi.string().allow("entier","partiel").required(),
    nbChambres: Joi.number().min(0).required(),
    capacite: Joi.number().min(1).required(),
    surface: Joi.number().min(9).required(),
    prixNuit: Joi.number().min(1).required(),
    imageSource: Joi.string().optional()
})

interface UpdateLogementRequest {
    id: number
    typeLocation?: TypeLocation
    nbChambres?: number
    capacite?: number
    surface?: number
    prixNuit?: number
    imageSource?: string
}

export const updateLogementValidation = Joi.object<UpdateLogementRequest>({
    id: Joi.number().min(0).required(),
    typeLocation: Joi.string().allow("entier","partiel").optional(),
    nbChambres: Joi.number().min(0).optional(),
    capacite: Joi.number().min(1).optional(),
    surface: Joi.number().min(9).optional(),
    prixNuit: Joi.number().min(1).optional(),
    imageSource: Joi.string().optional()
})

interface GetLogementRequest {
    id: number
}

export const getLogementValidation = Joi.object<GetLogementRequest>({
    id: Joi.number().min(0).required()
})

interface GetListLogementRequest {
    typeLogement?: TypeBien
    typeLocation?: TypeLocation
    nbChambres?: number
    capacite?: number
    surface?: number
    prixNuit?: number
    statut?: StatutLogement
}

export const getListLogementValidation = Joi.object<GetListLogementRequest>({
    typeLogement: Joi.string().allow("maison","appartement").optional(),
    typeLocation: Joi.string().allow("entier","partiel").optional(),
    nbChambres: Joi.number().min(0).optional(),
    capacite: Joi.number().min(1).optional(),
    surface: Joi.number().min(9).optional(),
    prixNuit: Joi.number().min(1).optional(),
    statut: Joi.string().allow("en attente","valide","refuse").optional()
})

interface UpdateStatutLogement {
    id: number,
    statut: StatutLogement
}

export const updateStatutLogementValidation = Joi.object<UpdateStatutLogement>({
    id: Joi.number().min(0).required(),
    statut: Joi.string().allow("en attente","refuse","valide")
})