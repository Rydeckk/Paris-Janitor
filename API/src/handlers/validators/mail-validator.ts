import Joi, { string } from "joi"
import { Service } from "../../database/entities/service"
import { TypeBien, TypeLocation } from "../../types/types"

interface SendMailDevis {
    devisId: number,
    email: string
}

export const sendMailDevisValidation = Joi.object<SendMailDevis>({
    devisId: Joi.number().min(1).required(),
    email: Joi.string().required()
})

interface SendMailFacture {
    factureId: number
}

export const sendMailFactureValidation = Joi.object<SendMailFacture>({
    factureId: Joi.number().min(1).required()
})