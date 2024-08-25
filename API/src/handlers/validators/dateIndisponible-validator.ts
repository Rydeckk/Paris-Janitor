import Joi from "joi"

interface CreateDateIndisponibleRequest {
    date: Date[]
    logementId: number
}

export const createDateIndisponibleValidation = Joi.object<CreateDateIndisponibleRequest>({
    date: Joi.array().items(Joi.date().iso()).required(),
    logementId: Joi.number().required()
})

interface DeleteDateIndisponibleRequest {
    id: number
    logementId: number
}

export const deleteDateIndisponibleValidation = Joi.object<DeleteDateIndisponibleRequest>({
    id: Joi.date().iso().required(),
    logementId: Joi.number().required()
})