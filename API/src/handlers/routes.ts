import express from "express"
import { UserHandler } from "./routes_user"
import { LogementHandler } from "./routes_logement"
import { RoleHandler } from "./routes_role"
import { PhotoHandler } from "./routes_photo"
import { ServiceHandler } from "./routes_services"
import { MailHandler } from "./routes_mail"
import { DevisHandler } from "./routes_devis"
import { ReservationHandler } from "./routes_reservation"
import { PayeHandler } from "./routes_paye"
import { FactureHandler } from "./routes_facture"
import { AbonnementHandler } from "./routes_abonnement"
import { SouscriptionHandler } from "./routes_souscription"
import { BannissementHandler } from "./routes_bannissement"
import { OperationHandler } from "./routes_operation"

export const initRoutes = (app: express.Express) => {

    UserHandler(app)
    RoleHandler(app)
    LogementHandler(app)
    PhotoHandler(app)
    ServiceHandler(app)
    MailHandler(app)
    DevisHandler(app)
    ReservationHandler(app)
    PayeHandler(app)
    FactureHandler(app)
    AbonnementHandler(app)
    SouscriptionHandler(app)
    BannissementHandler(app)
    OperationHandler(app)
}