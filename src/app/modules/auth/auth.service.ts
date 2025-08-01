
import AppError from "../../errorHelper/AppError";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utills/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"
import httpStatus from "http-status-codes"





const credentialsLoginService = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isExistUser = await User.findOne({ email })

    if (!isExistUser) {
        throw new Error("Email does not exist")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isExistUser.password as string)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }


    const userToken = createUserToken(isExistUser)


    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isExistUser.toObject() 



    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    }

}

const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

   return {
    accessToken: newAccessToken
   }
}


export const authService = {
    credentialsLoginService,
    getNewAccessToken
}