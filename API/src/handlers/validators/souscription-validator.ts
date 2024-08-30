import Joi from "joi"

interface GetListSouscriptionRequest {
    userId?: number
}

export const GetListSouscriptionValidation = Joi.object<GetListSouscriptionRequest>({
    userId: Joi.number().optional()
})