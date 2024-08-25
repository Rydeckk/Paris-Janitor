import Joi from "joi"

interface CreateReservationRequest {
    dateDebut: Date,
    dateFin: Date,
    montant: number,
    logementId: number,
}

export const createReservationValidation = Joi.object<CreateReservationRequest>({
    dateDebut: Joi.date().iso().required(),
    dateFin: Joi.date().iso().required(),
    montant: Joi.number().min(0).required(),
    logementId: Joi.number().min(1).required()
})

interface GetListReservationRequest {
    logementId?: number,
    userId?: number
}

export const getListReservationValidation = Joi.object<GetListReservationRequest>({
    logementId: Joi.number().optional(),
    userId: Joi.number().optional()
})

interface DeleteReservationRequest {
    id: number
}

export const deleteReservationValidation = Joi.object<DeleteReservationRequest>({
    id: Joi.number().required()
})

interface ServiceReservation {
    reservationId: number,
    id: number
}

export const serviceReservationValidation = Joi.object<ServiceReservation>({
    id: Joi.number().min(1).required(),
    reservationId: Joi.number().min(1).required()
})