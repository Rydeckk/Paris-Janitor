import Joi from "joi"

interface GetListOperationRequest {
    userId?: number
}

export const getListOperationValidation = Joi.object<GetListOperationRequest>({
    userId: Joi.number().optional()
})