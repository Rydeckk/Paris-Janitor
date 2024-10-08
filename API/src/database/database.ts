import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();


export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: true, 
    synchronize: true,
    timezone: 'Europe/Paris',
    entities: [
        "src/database/entities/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ],
    charset: "utf8mb4"
})