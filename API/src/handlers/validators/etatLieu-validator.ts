import Joi from "joi"
import { EtatEquipement } from "../../database/entities/etatEquipement"

export interface CreateEtatLieuRequest {
    reservationId: number,
    type: "entree" | "sortie",
    etatsEquipements: EtatEquipement[]
}

export const createEtatLieuValidation = Joi.object<CreateEtatLieuRequest>({
    reservationId: Joi.number().min(1).required(),
    type: Joi.string().allow("entree","sortie").required(),
    etatsEquipements: Joi.array().items().required()
})

interface GetEtatLieuRequest {
    id: number
}

export const getEtatLieuValidation = Joi.object<GetEtatLieuRequest>({
    id: Joi.number().required()
})

interface ListEtatLieuRequest {
    logementId?: number
}

export const listEtatLieuValidation = Joi.object<ListEtatLieuRequest>({
    logementId: Joi.number().min(1).optional()
}) 