import Joi from "joi"

interface CreatePhotoRequest {
    logementId: number
}

export const createPhotoValidation = Joi.object<CreatePhotoRequest>({
    logementId: Joi.number().min(1).required()
})

interface DeletePhotoRequest {
    id: number,
    logementId: number
}

export const deletePhotoValidation = Joi.object<DeletePhotoRequest>({
    id: Joi.number().min(0).required(),
    logementId: Joi.number().min(1).required()
})