import Joi from "joi"

interface CreatePhotoRequest {
    name: string,
    logementId: number
}

export const createPhotoValidation = Joi.object<CreatePhotoRequest>({
    name: Joi.string().min(1).required(),
    logementId: Joi.number().min(0).required()
})

interface DeletePhotoRequest {
    id: number,
    logementId: number
}

export const deletePhotoValidation = Joi.object<DeletePhotoRequest>({
    id: Joi.number().min(0).required(),
    logementId: Joi.number().min(0).required()
})