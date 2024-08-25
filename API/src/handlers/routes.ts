import express from "express"
import { UserHandler } from "./routes_user"
import { LogementHandler } from "./routes_logement"
import { RoleHandler } from "./routes_role"
import { PhotoHandler } from "./routes_photo"
import { ServiceHandler } from "./routes_services"
import { MailHandler } from "./routes_mail"
import { DevisHandler } from "./routes_devis"
import { ReservationHandler } from "./routes_reservation"

export const initRoutes = (app: express.Express) => {

    UserHandler(app)
    RoleHandler(app)
    LogementHandler(app)
    PhotoHandler(app)
    ServiceHandler(app)
    MailHandler(app)
    DevisHandler(app)
    ReservationHandler(app)
}