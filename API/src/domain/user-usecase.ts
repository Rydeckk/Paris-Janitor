import { DataSource } from "typeorm";
import { User } from "../database/entities/user";
import { Token } from "../database/entities/token";
import { Role } from "../database/entities/role";

export interface ListUserFilter {
    page: number,
    limit: number,
    isOwner?: boolean,
    isAdmin?: boolean,
    isBan?: boolean
}

export interface UpdateUserParams {
    password?: string,
    roleId?: number
}

export interface UpdateMyInfoUserParams {
    email?: string,
    firstName?: string,
    lastName?: string,
    phone?: string
}

export class UserUseCase {
    constructor(private readonly db: DataSource) { }

    async getListUser(listUserFilter: ListUserFilter): Promise<{ users: User[]; }> {
        const query = this.db.createQueryBuilder(User, 'user')
        query.skip((listUserFilter.page - 1) * listUserFilter.limit)
        query.take(listUserFilter.limit)
        query.innerJoinAndSelect('user.role','role')
        query.leftJoinAndSelect("user.devis", "devis")
        query.leftJoinAndSelect("user.reservations", "reservation")
        query.leftJoinAndSelect("user.logements","logements")
        query.leftJoinAndSelect("user.souscriptions","souscriptions")
        query.leftJoinAndSelect("user.operations", "ope")
        query.leftJoinAndSelect("user.notes", "note")

        if(listUserFilter.isAdmin !== undefined) {
            query.andWhere('role.isAdmin= :isAdmin', {isAdmin: listUserFilter.isAdmin})
        }

        if(listUserFilter.isOwner !== undefined) {
            query.andWhere('role.isOwner= :isOwner', {isOwner: listUserFilter.isOwner})
        }

        if(listUserFilter.isBan !== undefined) {
            if(listUserFilter.isBan) {
                query.innerJoinAndSelect("user.bannissements","banni")
                query.andWhere("banni.dateDebut <= :date", {date: new Date()})
                query.andWhere("banni.dateFin > :date",{date: new Date()})
            } else {
                query.leftJoinAndSelect("user.bannissements","banni")
                //Sous requête pour exclure les utilisateurs qui ont un bannissement en cours
                query.andWhere(qb => {
                    const subQuery = qb.subQuery()
                        .select("b2.id")
                        .from("Bannissement", "b2")
                        .where("b2.userId = user.id")
                        .andWhere("b2.dateFin > :date", { date: new Date() })
                        .getQuery();
                    return `NOT EXISTS ${subQuery}`;
                })
            }
        }

        const users = await query.getMany()
        return {
            users
        }
    }

    async getUser(id: number): Promise<User | null> {
        const query = this.db.createQueryBuilder(User, "user")
        query.innerJoinAndSelect("user.role","role")
        query.leftJoinAndSelect("user.devis", "devis")
        query.leftJoinAndSelect("user.reservations", "reservation")
        query.leftJoinAndSelect("user.logements","logements")
        query.leftJoinAndSelect("user.souscriptions","souscriptions")
        query.leftJoinAndSelect("user.bannissements","banni")
        query.leftJoinAndSelect("user.operations", "ope")
        query.leftJoinAndSelect("user.notes", "note")
        query.where("user.id = :id", {id: id})

        const userFound = await query.getOne()
        if (!userFound) return null

        return userFound
    }

    async getUserByToken(token: string): Promise<User | null> {
        const queryToken = this.db.createQueryBuilder(Token, 'token')
        queryToken.innerJoinAndSelect('token.user','user')
        queryToken.leftJoinAndSelect("user.devis", "devis")
        queryToken.leftJoinAndSelect("user.reservations", "reservation")
        queryToken.leftJoinAndSelect("user.logements","logements")
        queryToken.leftJoinAndSelect("user.souscriptions","souscriptions")
        queryToken.leftJoinAndSelect("user.bannissements","banni")
        queryToken.leftJoinAndSelect("user.operations", "ope")
        queryToken.leftJoinAndSelect("user.notes", "note")
        queryToken.where('token.token= token',{token: token})
        const tokenFound = await queryToken.getOne()

        if(!tokenFound) {
            return null
        }

        const queryUser = this.db.createQueryBuilder(User, 'user')
        queryUser.innerJoinAndSelect('user.role','role')
        queryUser.leftJoinAndSelect("user.devis", "devis")
        queryUser.leftJoinAndSelect("user.reservations", "reservation")
        queryUser.leftJoinAndSelect("user.logements","logements")
        queryUser.leftJoinAndSelect("user.souscriptions","souscriptions")
        queryUser.leftJoinAndSelect("user.bannissements","banni")
        queryUser.leftJoinAndSelect("user.operations", "ope")
        queryUser.leftJoinAndSelect("user.notes", "note")
        queryUser.where('user.id= :userId',{userId: tokenFound.user.id})

        const user = await queryUser.getOne()

        if (!user) {
            return null
        }

        return user
    }

    async updateUser(id: number, updateUser: UpdateUserParams): Promise<User | null> {
        const query = this.db.createQueryBuilder(User,"user")
        query.innerJoinAndSelect("user.role","role")
        query.leftJoinAndSelect("user.devis", "devis")
        query.leftJoinAndSelect("user.reservations", "reservation")
        query.leftJoinAndSelect("user.logements","logements")
        query.leftJoinAndSelect("user.souscriptions","souscriptions")
        query.leftJoinAndSelect("user.bannissements","banni")
        query.leftJoinAndSelect("user.operations", "ope")
        query.leftJoinAndSelect("user.notes", "note")
        query.where("user.id = :userId", {userId: id})

        const userFound = await query.getOne()

        if (userFound === null) return null

        if (updateUser.password) {
            userFound.password = updateUser.password
        }

        if(updateUser.roleId !== undefined) {
            const roleFound = await this.db.getRepository(Role).findOne({where: {id:updateUser.roleId} })
            if(roleFound) {
                userFound.role = roleFound
            }
        }

        const repo = this.db.getRepository(User)
        const userUpdate = await repo.save(userFound)
        return userUpdate
    }

    async updateMyInfoUser(id: number, updateUser: UpdateMyInfoUserParams): Promise<User | null> {
        const query = this.db.createQueryBuilder(User,"user")
        query.innerJoinAndSelect("user.role","role")
        query.leftJoinAndSelect("user.devis", "devis")
        query.leftJoinAndSelect("user.reservations", "reservation")
        query.leftJoinAndSelect("user.logements","logements")
        query.leftJoinAndSelect("user.souscriptions","souscriptions")
        query.leftJoinAndSelect("user.bannissements","banni")
        query.leftJoinAndSelect("user.operations", "ope")
        query.leftJoinAndSelect("user.notes", "note")
        query.where("user.id = :userId", {userId: id})

        const userFound = await query.getOne()

        if (userFound === null) return null

        if (updateUser.email) {
            userFound.email = updateUser.email
        }

        if (updateUser.firstName) {
            userFound.firstName = updateUser.firstName
        }

        if (updateUser.lastName) {
            userFound.lastName = updateUser.lastName
        }

        if (updateUser.phone) {
            userFound.phone = updateUser.phone
        }

        const repo = this.db.getRepository(User)
        const userUpdate = await repo.save(userFound)
        return userUpdate
    } 

    async deleteUser(id: number): Promise<User | null> {
        const query = this.db.createQueryBuilder(User,"user")
        query.innerJoinAndSelect("user.role","role")
        query.leftJoinAndSelect("user.devis", "devis")
        query.leftJoinAndSelect("user.reservations", "reservation")
        query.leftJoinAndSelect("user.logements","logements")
        query.leftJoinAndSelect("user.souscriptions","souscriptions")
        query.leftJoinAndSelect("user.bannissements","banni")
        query.leftJoinAndSelect("user.operations", "ope")
        query.leftJoinAndSelect("user.notes", "note")
        query.where("user.id = :userId", {userId: id})

        const userFound = await query.getOne()

        if(userFound === null) return null

        const deletedUser = userFound

        await this.db.getRepository(User).remove(userFound)
        return deletedUser
    }
}

export async function getConnectedUser(userId: number,db: DataSource): Promise<User | null> {

    const userUseCase = new UserUseCase(db)
    const userFound = await userUseCase.getUser(userId)
    if(!userFound) {
        return null
    }

    return userFound
}