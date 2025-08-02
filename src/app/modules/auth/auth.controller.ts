import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import httpStatus from "http-status-codes"
import AppError from "../../errorHelper/AppError";
import { setAuthCookie } from "../../utills/setCookies";


const credentialsLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginInfo = await authService.credentialsLoginService(req.body)

         setAuthCookie(res, loginInfo)

        res.status(200).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: loginInfo,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
        }

       
        const tokenInfo = await authService.getNewAccessToken(refreshToken as string)

        setAuthCookie(res, tokenInfo)
        
        res.status(200).json({
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: tokenInfo,
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


// logout only below and router.post('/logout', controler.logut)

const logoutUser = (req: Request, res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    res.status(httpStatus.OK).json({
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged out successfully",
        data: null
    })
}


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logoutUser
}