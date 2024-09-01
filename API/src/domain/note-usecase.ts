import { DataSource } from "typeorm"
import { Note } from "../database/entities/note"
import { User } from "../database/entities/user"

interface ListNoteFilter {
    serviceId?: number
}

interface NoteUpdate {
    titre?: string, 
    numero?: number, 
    commentaire?: string
}

export class NoteUseCase {
    constructor(private readonly db: DataSource) { }

    async getNote(id: number): Promise <Note | null> {
        const noteFound = await this.db.getRepository(Note).findOne({where: {id: id}, relations: ["user","service"]})
        if(noteFound === null) return null

        return noteFound
    }

    async getListNote(filter: ListNoteFilter): Promise<{notes: Note[]}> {
        const query = this.db.createQueryBuilder(Note, "note")
        query.innerJoinAndSelect("note.user", "user")
        query.innerJoinAndSelect("note.service", "service")
        
        if(filter.serviceId) {
            query.andWhere("service.id = :serviceId", {serviceId: filter.serviceId})
        }

        const notes = await query.getMany()
        return {
            notes
        }
    }

    async updateNote(id: number, param: NoteUpdate, user: User): Promise<Note | null> {
        const query = this.db.createQueryBuilder(Note, "note")
        query.innerJoinAndSelect("note.service","service")
        query.innerJoinAndSelect("note.user","user")
        query.where("note.id = :noteId", {noteId: id})
        if(!user.role.isAdmin) {
            query.andWhere("user.id = :userId", {userId: user.id})
        }

        const noteFound = await query.getOne()
        if(noteFound === null) return null

        if(param.titre) {
            noteFound.titre = param.titre
        }

        if(param.numero) {
            noteFound.numero = param.numero
        }

        if(param.commentaire) {
            noteFound.commentaire = param.commentaire
        }

        const repo = this.db.getRepository(Note)
        const noteUpdated = await repo.save(noteFound)
        return noteUpdated
    }

    async deleteNote(id: number, user: User): Promise<Note | null> {
        const query = this.db.createQueryBuilder(Note, "note")
        query.innerJoinAndSelect("note.service","service")
        query.innerJoinAndSelect("note.user","user")
        query.where("note.id = :noteId", {noteId: id})
        if(!user.role.isAdmin) {
            query.andWhere("user.id = :userId", {userId: user.id})
        }
        
        const noteFound = await query.getOne()
        if(noteFound === null) return null

        const repo = this.db.getRepository(Note)
        await repo.delete({id: id})
        return noteFound
    }
}