import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddlewareAdmin } from "./middleware/auth_middleware"
import { BannissementUseCase } from "../domain/bannissement-usecase"
import { AppDataSource } from "../database/database"

export const BannissementHandler = (app: express.Express) => {
    app.get("/bannissement",authMiddlewareAdmin, async (req: Request, res: Response) => {
        try {
            const banniUseCase = new BannissementUseCase(AppDataSource)
            const banniList = await banniUseCase.getListBannissement()
            res.status(200).send(banniList.bannissements)
        }catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}