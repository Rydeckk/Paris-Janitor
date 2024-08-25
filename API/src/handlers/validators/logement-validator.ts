import Joi from "joi"
import { StatutLogement, TypeBien, TypeLocation } from "../../types/types"

interface CreateLogementRequest {
    nom: string,
    adresse: string
    codePostal: string
    ville: string,
    pays: string
    typeLogement: TypeBien
    typeLocation: TypeLocation
    nbChambres: number
    capacite: number
    surface: number
    prixNuit: number
}

export const createLogementValidation = Joi.object<CreateLogementRequest>({
    adresse: Joi.string().required(),
    codePostal: Joi.string().min(5).max(5).required(),
    ville: Joi.string().required(),
    pays: Joi.string().required(),
    nom: Joi.string().min(2).required(),
    typeLogement: Joi.string().valid("maison","appartement").required(),
    typeLocation: Joi.string().valid("entier","partiel").required(),
    nbChambres: Joi.number().min(0).required(),
    capacite: Joi.number().min(1).required(),
    surface: Joi.number().min(9).required(),
    prixNuit: Joi.number().min(1).required()
})

interface UpdateLogementRequest {
    id: number
    nom?: string,
    typeLocation?: TypeLocation
    nbChambres?: number
    capacite?: number
    surface?: number
    prixNuit?: number
}

export const updateLogementValidation = Joi.object<UpdateLogementRequest>({
    id: Joi.number().min(1).required(),
    nom: Joi.string().min(2).optional(),
    typeLocation: Joi.string().valid("entier","partiel").optional(),
    nbChambres: Joi.number().min(0).optional(),
    capacite: Joi.number().min(1).optional(),
    surface: Joi.number().min(9).optional(),
    prixNuit: Joi.number().min(1).optional()
})

interface GetLogementRequest {
    id: number
}

export const getLogementValidation = Joi.object<GetLogementRequest>({
    id: Joi.number().min(1).required()
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
    typeLogement: Joi.string().valid("maison","appartement").optional(),
    typeLocation: Joi.string().valid("entier","partiel").optional(),
    nbChambres: Joi.number().min(0).optional(),
    capacite: Joi.number().min(1).optional(),
    surface: Joi.number().min(9).optional(),
    prixNuit: Joi.number().min(1).optional(),
    statut: Joi.string().valid("attenteValidation","valide","refuse","inactif").optional()
})

interface UpdateStatutLogement {
    id: number,
    statut: StatutLogement
}

export const updateStatutLogementValidation = Joi.object<UpdateStatutLogement>({
    id: Joi.number().min(1).required(),
    statut: Joi.string().valid("attenteValidation","refuse","valide","inactif").required()
})

interface ServiceLogement {
    logementId: number,
    id: number
}

export const serviceLogementValidation = Joi.object<ServiceLogement>({
    id: Joi.number().min(1).required(),
    logementId: Joi.number().min(1).required()
})