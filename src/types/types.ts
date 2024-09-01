export type Logement = {
    id: number
    nom: string
    adresse: string
    codePostal: string,
    ville: string,
    pays: string,
    typeLogement: TypeBien
    typeLocation: TypeLocation
    nbChambres: number
    capacite: number
    surface: number
    prixNuit: number
    statut: StatutLogement
    isActif: boolean
    createdAt: Date
    photos: Photo[]
    datesIndisponibles: DateIndisponible[]
    reservations: Reservation[]
    user: UserInfo
    services: Service[]
    equipements: Equipement[]
}

export type CreateLogement = {
    nom: string
    adresse: string
    codePostal: string,
    ville: string,
    pays: string,
    typeLogement: TypeBien
    typeLocation: TypeLocation
    nbChambres: number
    capacite: number
    surface: number
    prixNuit: number
}

export type LogementUpdate = {
    nom: string,
    typeLocation: TypeLocation,
    nbChambres: number,
    surface: number,
    prixNuit: number,
    capacite: number
}

export type Photo = {
    id: number
    name: string
    path: string
    logement: Logement
}

export type Service = {
    id: number
    nom: string
    type: TypeService
    prix: number
    logements: Logement[]
    reservations: Reservation[],
    notes: Note[]
}

export type ServiceCreate = {
    nom: string
    type: TypeService
    prix: number
}

export type Role = {
    id: number,
    name: string,
    isOwner: boolean,
    isAdmin: boolean
}

export type UserInfo = {
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    role: Role
}

export type UserInfoWithId = {
    id: number,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    role: Role,
    bannissements: Bannissement[],
    notes: Note[]
}

export type DevisData = {
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
    services: Service[],
    total: number
}

export type LoginInfo = {
    email: string,
    password: string,
    type: TypeUser
}

export type SignUpInfo = {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    type: TypeUser
}

export type DateIndisponible = {
    id: number,
    date: Date,
    logement: Logement
}

export type Devis = {
    id: number,
    nomDevis: string,
    nomPersonne: string,
    prenom: string,
    dateCreation: Date, 
    user?: UserInfoWithId
}

export type CreateReservation = {
    dateDebut: Date,
    dateFin: Date,
    montant: number,
    services: Service[]
}

export type Reservation = {
    id: number, 
    dateDebut: Date, 
    dateFin: Date,
    montant: number,
    dateCreation: Date, 
    user: UserInfoWithId, 
    logement: Logement, 
    services: Service[],
    facture: Facture
}

export type Facture = {
    id: number,
    nomFacture: string,
    numeroFacture: string,
    nomPersonne: string,
    prenom: string,
    montant: number,
    dateCreation: Date,
    user: UserInfoWithId,
    reservation: Reservation
    souscription: Souscription
}

export type Abonnement = {
    id: number,
    nom: string,
    montant: number,
    souscriptions: Souscription[]
}

export type Souscription = {
    id: number,
    montant: number,
    dateDebut: Date,
    dateFin: Date,
    user: UserInfoWithId,
    abonnement: Abonnement,
    facture: Facture
}

export type Bannissement = {
    id: number,
    motif: string,
    dateDebut: Date,
    dateFin: Date,
    user: UserInfoWithId,
}

export type CreateBannissement = {
    motif: string,
    dateDebut: Date,
    dateFin: Date
}

export type Operation = {
    id: number,
    montant: number,
    description: string,
    type: TypeOperation,
    dateExecuter: Date,
    user: UserInfoWithId
}

export type Note = {
    id: number, 
    titre: string, 
    numero: number, 
    commentaire: string, 
    user: UserInfoWithId, 
    service: Service
}

export type CreateNote = {
    titre: string, 
    numero: number, 
    commentaire: string
}

export type Equipement = {
    id: number, 
    nom: string, 
    etat: EtatEquip, 
    logement: Logement
}

export type CreateEquipement = {
    nom: string, 
    etat: EtatEquip
}

export type TypeUser = "traveler" | "owner" | "admin"

export type TypeSpace = "traveler" | "owner" | "admin"

export type StatutLogement = "attenteValidation" | "valide" | "refuse"

export type TypeBien = "maison" | "appartement"

export type TypeLocation = "entier" | "partiel"

export type TypeService = "traveler" | "owner"

export type TypeOperation = "paye" | "gagne"

export type EtatEquip = "neuf" | "tresBonEtat" | "bonEtat" | "etatUsage" | "mauvaisEtat"

export const spaceColors: Record<TypeSpace, string> = {
    traveler: '#bda34d', 
    owner: '#519164', 
    admin: '#584bd1' 
}

export const statutColors: Record<StatutLogement,string> = {
    attenteValidation: "rgba(201, 179, 57, 0.2)",
    valide: "rgba(57, 201, 100, 0.2)",
    refuse: "rgba(161, 73, 67, 0.2)"
}

export const statutLogementString: Record<StatutLogement, string> = {
    attenteValidation: "En attente",
    valide: "Validé",
    refuse: "Refusé"
}

export const typeLocationString: Record<TypeLocation, string> = {
    entier: "Tout le logement",
    partiel: "Une partie du logement"
}

export const typeBienString: Record<TypeBien, string> = {
    maison: "Maison",
    appartement: "Appartement"
}

export const typeServiceString: Record<TypeService, string> = {
    traveler: "Voyageur",
    owner: "Bailleur"
}

export const EtatEquipString: Record<EtatEquip, string> = {
    neuf: "Neuf",
    tresBonEtat: "Très bon état",
    bonEtat: "Bon état",
    etatUsage: "Etat d'usage",
    mauvaisEtat: "Mauvais état"
}

export type country = {
    id: string,
    name: string
}