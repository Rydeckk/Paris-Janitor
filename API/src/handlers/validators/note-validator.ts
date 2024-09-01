import Joi from "joi"

interface CreateNote {
    titre: string,
    numero: number,
    commentaire: string,
    serviceId: number
}

export const createNoteValidation = Joi.object<CreateNote>({
    titre: Joi.string().required(),
    numero: Joi.number().min(1).max(5).required(),
    commentaire: Joi.string().required(),
    serviceId: Joi.number().min(1).required()
})

interface ListeNote {
    serviceId: number
}

export const getListNoteValidation = Joi.object<ListeNote>({
    serviceId: Joi.number().min(1).required()
})

interface UpdateNote {
    id: number,
    titre?: string,
    numero?: number,
    commentaire?: string,
}

export const updateNoteValidation = Joi.object<UpdateNote>({
    titre: Joi.string().optional(),
    numero: Joi.number().min(1).max(5).optional(),
    commentaire: Joi.string().optional(),
    id: Joi.number().min(1).required()
})

interface GetNote {
    id: number
}

export const getNoteValidation = Joi.object<GetNote>({
    id: Joi.number().min(1).required()
})