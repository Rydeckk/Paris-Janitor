import Joi from "joi"
import { EtatEquip } from "../../types/types"

interface CreateEquipement {
    nom: string,
    etat: EtatEquip,
    logementId: number
}

export const createEquipementValidation = Joi.object<CreateEquipement>({
    nom: Joi.string().required(),
    etat: Joi.string().allow("neuf","tresBonEtat","bonEtat","etatUsage","mauvaisEtat").required(),
    logementId: Joi.number().min(1).required()
})

interface ListeEquipement {
    logementId: number
}

export const getListEquipementValidation = Joi.object<ListeEquipement>({
    logementId: Joi.number().min(1).required()
})

interface UpdateEquipement {
    id: number,
    nom?: string,
    etat?: EtatEquip,
    logementId: number
}

export const updateEquipementValidation = Joi.object<UpdateEquipement>({
    nom: Joi.string().optional(),
    etat: Joi.string().allow("neuf","tresBonEtat","bonEtat","etatUsage","mauvaisEtat").optional(),
    id: Joi.number().min(1).required(),
    logementId: Joi.number().min(1).required()
})

interface GetEquipement {
    id: number,
    logementId: number
}

export const getEquipementValidation = Joi.object<GetEquipement>({
    id: Joi.number().min(1).required(),
    logementId: Joi.number().min(1).required()
})