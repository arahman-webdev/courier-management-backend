import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { IAuthProvider } from "./user.interface";
const createUserService = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password, ...rest } = req.body

       console.log(rest)

        const isExistUser = await User.findOne({ email })

        if (isExistUser) {
            throw new Error("Email already exist")
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const authProvider: IAuthProvider = { provider: "credential", providerId: email }

        // const user = await User.create({
        //     email,
        //     password: hashPassword,
        //     auth: [authProvider],
        //     ...rest
        // })

        console.log(user)

        res.json({
            success: true,
            message: "User created successfully",
            data: user
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}


export const userSerivice = {
    createUserService
}


