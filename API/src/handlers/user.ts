import express, { Response } from "express"
import { AppDataSource } from "../database/database"
import { compare, hash } from "bcrypt";
import { createUserValidation, LoginUserValidation } from "./validators/user-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages";
import { User } from "../database/entities/user";
import { sign } from "jsonwebtoken";
import { Token } from "../database/entities/token";
import { Role } from "../database/entities/role";
import { authMiddleware } from "./middleware/auth_middleware";
import { Request } from "../types/express"
import { getConnectedUser } from "../domain/user-usecase";

export const UserHandler = (app: express.Express) => {
    app.post('/auth/signup', async (req: Request, res: Response) => {
        try {

            const validationResult = createUserValidation.validate({...req.query, ...req.body})
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const createUserRequest = validationResult.value
            const hashedPassword = await hash(createUserRequest.password, 10);

            const repoRole = AppDataSource.getRepository(Role)
            let roleFound : Role | null = null
            if (createUserRequest.type === "owner") {
                roleFound = await repoRole.findOne({where : {isOwner: true, isAdmin: false}})
            } else if (createUserRequest.type === "traveler") {
                roleFound = await repoRole.findOne({where : {isOwner: false, isAdmin: false}})
            }
            if (roleFound === null) {
                res.status(404).send({"error": "Aucun role disponible"})
                return
            }

            const userRepository = AppDataSource.getRepository(User)
            const user = await userRepository.save({
                email: createUserRequest.email,
                password: hashedPassword,
                firstName: createUserRequest.firstName,
                lastName: createUserRequest.lastName,
                role: roleFound
            });

            res.status(201).send({ 
                id: user.id, 
                email: user.email,
                firstName: createUserRequest.firstName,
                lastName: createUserRequest.lastName,
                createdAt: user.createdAt, 
                role: user.role.name 
            })
            return
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.post('/auth/login', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginUserValidation.validate({...req.query, ...req.body})
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginUserRequest = validationResult.value

            const repoRole = AppDataSource.getRepository(Role)
            let roleFound : Role | null = null
            if (loginUserRequest.type === "owner") {
                roleFound = await repoRole.findOne({where : {isOwner: true, isAdmin: false}})
            } else if (loginUserRequest.type === "admin") {
                roleFound = await repoRole.findOne({where : {isOwner: true, isAdmin: true}})
            } else {
                roleFound = await repoRole.findOne({where : {isOwner: false, isAdmin: false}})
            }
            if (roleFound === null) {
                res.status(404).send({"error": "Aucun role disponible"})
                return
            }

            // valid user exist
            const user = await AppDataSource.getRepository(User).findOneBy({ email: loginUserRequest.email, role: roleFound});

            if (!user) {
                res.status(400).send({ error: "username or password not valid" })
                return
            }

            // valid password for this user
            const isValid = await compare(loginUserRequest.password, user.password);
            if (!isValid) {
                res.status(400).send({ error: "username or password not valid" })
                return
            }
            
            const secret = process.env.JWT_SECRET ?? ""
            // generate jwt
            const token = sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1d' });
            // stock un token pour un user
            await AppDataSource.getRepository(Token).save({ token: token, user: user })
            res.status(200).json({ token });
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.delete('/auth/logout', authMiddleware , async (req: Request, res: Response) => {
        try {

            const authHeader = req.headers['authorization'];
            if (!authHeader) return res.status(401).json({"error": "Unauthorized"});

            const token = authHeader.split(' ')[1];
            if (token === null) return res.status(401).json({"error": "Unauthorized"});

            const queryToken = AppDataSource.createQueryBuilder(Token, 'token')
            queryToken.innerJoinAndSelect('token.user','user')
            queryToken.where('token.token= token',{token: token})
            const tokenFound = await queryToken.getOne()

            if(!tokenFound) {
                return res.status(404).json({"error": `Token ${token} not found`});
            }

            const user = await AppDataSource.getRepository(User).findOneBy({ id: tokenFound.user.id });

            if (!user) {
                res.status(400).send({ error: "User not found" })
                return
            }

            const repoTokenUser = AppDataSource.getRepository(Token)
            const queryTokens = AppDataSource.createQueryBuilder(Token, 'token')
            queryTokens.innerJoinAndSelect('token.user','user')
            queryTokens.where('user.id= :userId',{userId: user.id})
            const tokensFound = await queryTokens.getMany()

            tokensFound.forEach((token) => {
                repoTokenUser.delete(token)
            })

            res.status(200).send("Deconnexion réussi");
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.get("/auth/info", authMiddleware, async (req: Request, res: Response) => {
        const userId = +req.user.userId
        const userFound = await getConnectedUser(userId, AppDataSource)
        if(userFound) {
            res.status(200).send({
                id: userFound.id,
                email: userFound.email, 
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                role: userFound.role
                })
        } else {
            res.status(404).send({"error": "User not found"})
        }

        return
    })

}