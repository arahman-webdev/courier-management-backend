import { NextFunction, Request, Response } from "express";
import { userSerivice } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const user = await userSerivice.createUserService(req.body)

        res.json({
            success: true,
            messge: "User created successfully",
            data: user
        })
    } catch (error) {
        next(error)
    }
}


const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const getUsers = await userSerivice.getAllUsersService()

        res.json({
            success: true,
            message: "User retreived succssfully",
            data: getUsers
        })
    } catch (error) {
        next(error)
    }
}


const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id
        const payload = req.body
        const decodedToken = req.user
        const updateUser = await userSerivice.updateUserService(userId, payload, decodedToken)

        res.json({
            success: true,
            message: "User updated succssfully",
            data: updateUser
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


export const UserController = {
    createUser,
    getAllUsers,
    updateUser
}