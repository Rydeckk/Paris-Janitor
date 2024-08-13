import { DataSource } from "typeorm";
import { Role } from "../database/entities/role";

export interface UpdateRoleParams {
    name?: string,
    isOwner?: boolean,
    isAdmin?: boolean
}

export interface ListRoleFilter {
    limit: number,
    page: number,
    isOwner?: boolean,
    isAdmin?: boolean
}

export class RoleUseCase {
    constructor(private readonly db: DataSource) { }

    async getRole(id: number): Promise<Role | null> {
        const repo = this.db.getRepository(Role)
        const roleFound = await repo.findOne({where : {id: id}})
        if (roleFound === null) return null

        return roleFound
    }

    async getListRole(listRoleFilter: ListRoleFilter): Promise<{ roles: Role[]; }> {
        const query = this.db.createQueryBuilder(Role, 'role')
        query.skip((listRoleFilter.page - 1) * listRoleFilter.limit)
        query.take(listRoleFilter.limit)

        if(listRoleFilter.isOwner !== undefined) {
            query.andWhere("role.isOwner = :isOwner", {isOwner: listRoleFilter.isOwner})
        }

        if(listRoleFilter.isAdmin !== undefined) {
            query.andWhere("role.isAdmin = :isAdmin", {isAdmin: listRoleFilter.isAdmin})
        }

        const roles = await query.getMany()
        return {
            roles
        }
    }

    async updateRole(id: number, roleParam: UpdateRoleParams): Promise<Role | null> {
        const repo = this.db.getRepository(Role)
        const roleFound = await repo.findOne({where: {id:id} })

        if (roleFound === null) return null

        if (roleParam.name) {
            roleFound.name = roleParam.name
        }

        if(roleParam.isOwner !== undefined) {
            roleFound.isOwner = roleParam.isOwner
        }

        if(roleParam.isAdmin !== undefined) {
            roleFound.isAdmin = roleParam.isAdmin
        }

        const roleUpdate = await repo.save(roleFound)
        return roleUpdate
    }

    async deleteRole(id: number): Promise<Role | null> {
        const repo = this.db.getRepository(Role)
        const rolefound = await repo.findOne({where: {id:id} })
        if (rolefound === null) return null

        repo.delete({ id })
        return rolefound
    }
}