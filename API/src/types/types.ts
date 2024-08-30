import { Service } from "../database/entities/service"

export type TypeUser = "traveler" | "owner" | "admin"

export type StatutLogement = "attenteValidation" | "valide" | "refuse"

export type TypeBien = "maison" | "appartement"

export type TypeLocation = "entier" | "partiel"

export type TypeService = "traveler" | "owner"

export type devisData = {
    adresse: string,
    codePostal: string
    ville: string,
    pays: string,
    typeBien : TypeBien,
    typeLocation: TypeLocation,
    nbChambres :number,
    capacite: number,
    surface: number,
    prixNuit: number,
    nom: string,
    prenom: string,
    email: string,
    tel: string,
    services: Service[]
    total: number
}

export const typeLocationString: Record<TypeLocation, string> = {
    entier: "Tout le logement",
    partiel: "Une partie du logement"
}

export const typeBienString: Record<TypeBien, string> = {
    maison: "Maison",
    appartement: "Appartement"
}