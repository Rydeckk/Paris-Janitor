import express from "express";
import { initRoutes } from "./handlers/routes";
import { AppDataSource } from "./database/database";
import cors from "cors"
import path from "path"



const main = async () => {
    const app = express()
    const port = 3000

    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    }

    app.use(cors(corsOptions))

    try {

        await AppDataSource.initialize()

        console.error("well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }

    const uploadsDir = path.join(__dirname, '../uploads/images/');

    app.use('/images', express.static(uploadsDir));

    app.use(express.json(({ limit: '10mb' })))

    initRoutes(app)
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()