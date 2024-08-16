import express from "express"
import { UserHandler } from "./user"
import { LogementHandler } from "./routes_logement"
import { RoleHandler } from "./routes_role"
import { PhotoHandler } from "./routes_photo"
import { ServiceHandler } from "./routes_services"

export const initRoutes = (app: express.Express) => {

    UserHandler(app)
    RoleHandler(app)
    LogementHandler(app)
    PhotoHandler(app)
    ServiceHandler(app)
}