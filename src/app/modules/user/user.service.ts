
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { IAuthProvider, IUser } from "./user.interface";
import { envVars } from "../../config/env";
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

const updateUserService = async(userId:string, payload: Partial<IUser>)=>{
    const isUser = await User.findById(userId)

    if(!isUser){
        throw new Error("User is not found")
    }

    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password,  Number(envVars.BCRYPT_SALT_ROUNDS))
    }

    const updateUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidators: true}) 

    return updateUser
}



export const userSerivice = {
    createUserService,
    getAllUsersService,
    updateUserService
}


