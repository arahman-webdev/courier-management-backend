
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { IAuthProvider, IUser } from "./user.interface";
const createUserService = async (payload: IUser) => {

    const { email, password, ...rest } = payload

    const isExistingUser = await User.findOne({ email })

    if (isExistingUser) {
        throw new Error("Email already exist")
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password as string, salt);

    const authProvider:IAuthProvider = {provider: "credential", providerId: email as string}

    const user = await User.create({
        email,
        password: hashPassword,
        auth:[authProvider],
        ...rest
    })

    return user

}


const getAllUsersService = async()=>{

    const getAllUsers = await User.find()
    return getAllUsers
}


export const userSerivice = {
    createUserService,
    getAllUsersService
}


