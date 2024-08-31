import Joi, { object } from "joi";

interface CreateBannissementRequest {
    id: number
    motif: string
    dateDebut: Date
    dateFin: Date
}

export const createBannissementValidation = Joi.object<CreateBannissementRequest>({
    id: Joi.number().required(),
    motif: Joi.string().required(),
    dateDebut: Joi.date().iso().required(),
    dateFin: Joi.date().iso().required(),
})

interface UpdateBannissementRequest {
    id: number,
    bannissementId: number,
    dateFin: Date
}

export const updateBannissementValidation = Joi.object<UpdateBannissementRequest>({
    id: Joi.number().required(),
    bannissementId: Joi.number().required(),
    dateFin: Joi.date().iso().required()
})