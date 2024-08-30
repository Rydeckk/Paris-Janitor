import Joi from "joi"

interface CreateFactureRequest {
    nomPersonne: string,
    prenom: string,
    montant: number
}

export const createFactureValidation = Joi.object<CreateFactureRequest>({
    nomPersonne: Joi.string().required(),
    prenom: Joi.string().required(),
    montant: Joi.number().required()
})

interface GetFactureRequest {
    id: number
}

export const getFactureValidation = Joi.object<GetFactureRequest>({
    id: Joi.number().required()
})

interface ListFactureRequest {
    userId?: number
}

export const listFactureValidation = Joi.object<ListFactureRequest>({
    userId: Joi.number().min(1).optional()
}) 