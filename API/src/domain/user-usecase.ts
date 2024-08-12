import { DataSource } from "typeorm";
import { User } from "../database/entities/user";
import { Token } from "../database/entities/token";
import { Role } from "../database/entities/role";

export interface ListUserFilter {
    page: number,
    limit: number,
    isOwner?: boolean,
    isAdmin?: boolean
}

export interface UpdateUserParams {
    password?: string,
    roleId?: number
}

export interface UpdateMyInfoUserParams {
    email?: string,
    firstName?: string,
    lastName?: string
}

export class UserUseCase {
    constructor(private readonly db: DataSource) { }

    async getListUser(listUserFilter: ListUserFilter): Promise<{ users: User[]; }> {
        const query = this.db.createQueryBuilder(User, 'user')
        query.skip((listUserFilter.page - 1) * listUserFilter.limit)
        query.take(listUserFilter.limit)
        query.innerJoinAndSelect('user.role','role')

        if(listUserFilter.isAdmin !== undefined) {
            query.andWhere('role.isAdmin= :isAdmin', {isAdmin: listUserFilter.isAdmin})
        }

        if(listUserFilter.isOwner !== undefined) {
            query.andWhere('role.isOwner= :isOwner', {isOwner: listUserFilter.isOwner})
        }

        const users = await query.getMany()
        return {
            users
        }
    }

    async getUser(id: number): Promise<User | null> {
        const query = this.db.createQueryBuilder(User, "user")
        query.innerJoinAndSelect("user.role","role")
        query.where("user.id = :id", {id: id})

        const userFound = await query.getOne()
        if (!userFound) return null

        return userFound
    }

    async getUserByToken(token: string): Promise<User | null> {
        const queryToken = this.db.createQueryBuilder(Token, 'token')
        queryToken.innerJoinAndSelect('token.user','user')
        queryToken.where('token.token= token',{token: token})
        const tokenFound = await queryToken.getOne()

        if(!tokenFound) {
            return null
        }

        const queryUser = this.db.createQueryBuilder(User, 'user')
        queryUser.innerJoinAndSelect('user.role','role')
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

        const repo = this.db.getRepository(User)
        const userUpdate = await repo.save(userFound)
        return userUpdate
    } 

    async deleteUser(id: number): Promise<User | null> {
        const query = this.db.createQueryBuilder(User,"user")
        query.innerJoinAndSelect("user.role","role")
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