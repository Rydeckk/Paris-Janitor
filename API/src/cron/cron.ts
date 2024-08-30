import cron from "node-cron"
import { UserUseCase } from "../domain/user-usecase"
import { AppDataSource } from "../database/database"
import { SouscriptionUseCase } from "../domain/souscription-usecase"
import { Logement } from "../database/entities/logement"

async function checkAbonnementActif() {
    const userUseCase = new UserUseCase(AppDataSource)
    const users = await userUseCase.getListUser({page: 1, limit: 99999, isOwner: true, isAdmin: false})
    users.users.forEach(async (user) => {
        const souscriptionUseCase = new SouscriptionUseCase(AppDataSource)
        console.log(user.id)
        const actualAbonnement = await souscriptionUseCase.getMyActualSouscription(user.id)
        
        if(!actualAbonnement) {
            user.logements.forEach(async (logement) => {
                await AppDataSource.getRepository(Logement).save({...logement,isActif: false})
            })
        }
    })
}

export const scheduleTask = () => {
    cron.schedule('0 0 * * *',async () => await checkAbonnementActif(),
    {
        scheduled: true,
        timezone: "Europe/Paris"
    })

}