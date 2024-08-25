import Joi from "joi"
import { Service } from "../../database/entities/service"
import { TypeBien, TypeLocation } from "../../types/types"

interface CreateDevisRequest {
    adresse: string,
    codePostal: string
    ville: string,
    pays: string,
    typeBien : TypeBien,
    typeLocation: TypeLocation,
    nbChambres :number,
    capacite: number,
    surface: number,
    prixNuit: number,
    nom: string,
    prenom: string,
    email: string,
    tel: string,
    services: Service[],
    total: number
}

export const createDevisValidation = Joi.object<CreateDevisRequest>({
    adresse: Joi.string().required(),
    codePostal: Joi.string().min(5).max(5).required(),
    ville: Joi.string().required(),
    pays: Joi.string().required(),
    typeBien : Joi.string().allow("maison","appartement").required(),
    typeLocation: Joi.string().allow("entier","partiel").required(),
    nbChambres :Joi.number().min(0).required(),
    capacite: Joi.number().min(1).required(),
    surface: Joi.number().min(9).required(),
    prixNuit: Joi.number().min(0).required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    email: Joi.string().required(),
    tel: Joi.string().required(),
    services: Joi.array().items(Joi.object<Service>({
        id: Joi.number().required(),
        nom: Joi.string().required(),
        type: Joi.string().allow("traveler","owner").required(),
        prix: Joi.number().min(0).required(),
        logements: Joi.array().optional()
    })),
    total: Joi.number().required()
})

interface ListDevisRequest {
    userId?: number
}

export const listDevisValidation = Joi.object<ListDevisRequest>({
    userId: Joi.number().min(1).optional()
}) 

interface GetDevisRequest {
    id: number
}

export const getDevisValidation = Joi.object<GetDevisRequest>({
    id: Joi.number().required()
})