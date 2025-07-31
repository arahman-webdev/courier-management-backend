
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelper/AppError";
import statusCodes from "http-status-codes"

const createUserService = async (payload: IUser) => {

    const { email, password, ...rest } = payload

    const isExistingUser = await User.findOne({ email })

    if (isExistingUser) {
        throw new Error("Email already exist")
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password as string, salt);

    const authProvider: IAuthProvider = { provider: "credential", providerId: email as string }

    const user = await User.create({
        email,
        password: hashPassword,
        auth: [authProvider],
        ...rest
    })

    return user

}


const getAllUsersService = async () => {

    const getAllUsers = await User.find()
    return getAllUsers
}

const updateUserService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isUser = await User.findById(userId)



    if (!isUser) {
        throw new AppError(statusCodes.NOT_FOUND, "User not found");
    }


    // Normal users cannot update others
    if (decodedToken.userRole === Role.SENDER || decodedToken.userRole === Role.RECEIVER) {
        if (decodedToken.userId !== userId) {
            throw new AppError(statusCodes.FORBIDDEN, "You are not authorized to update this user.");
        }
    }
    // 🚫 Role update restriction

    if (payload.role) {
        if (decodedToken.userRole === Role.RECEIVER || decodedToken.userRole === Role.SENDER) {
            throw new AppError(statusCodes.FORBIDDEN, "You are not authorized to update role.");
        }

        if (payload.role === Role.ADMIN && decodedToken.userRole === Role.ADMIN) {
            throw new AppError(statusCodes.FORBIDDEN, "You are not authorized to set admin role.");
        }
    }
    if (payload.isActive || payload.isVerified) {
        if (decodedToken.userRole === Role.RECEIVER || decodedToken.userRole === Role.SENDER) {
            throw new AppError(statusCodes.FORBIDDEN, "You are not authorized");
        }
    }

    // ✅ Hash password if present
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUNDS));
    }

    const updateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return updateUser
}



export const userSerivice = {
    createUserService,
    getAllUsersService,
    updateUserService
}


