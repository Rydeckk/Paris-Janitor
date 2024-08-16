import { Request } from 'express';
import { User } from '../database/entities/user';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: any
    }
}

export { Request };

export type TypeUser = "traveler" | "owner" | "admin"

export type StatutLogement = "attenteValidation" | "valide" | "refuse" | "inactif"

export type TypeBien = "maison" | "appartement"

export type TypeLocation = "entier" | "partiel"

export type TypeService = "traveler" | "owner"