/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"

import AppError from "../errorHelper/AppError"

import { handleCastError } from "../errors/handleCastError"
import { handleDuplicateError } from "../errors/handleDuplicateError"
import { envVars } from "../config/env"


// eslint-disable-next-line no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    // console.log("Error from error handler", err)

    let statusCode = 500
    let message = "Something Went Wrong!!"
    const errorSource: any = []


    // duplicate error -----------
    if (err.code === 11000) {

        const simplifiedError = handleDuplicateError(err)

        statusCode = simplifiedError.statusCode;

        message = simplifiedError.message
    }



    // cast error -----------

    else if (err.name === "CastError") {

        const simplifiedError = handleCastError(err)

        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }

    // Zod error

    else if (err.name === "ZodError") {
        statusCode = 400;
        message = "Zod Error";

        err.issues.forEach((issue: any) => {
            errorSource.push({
                path: issue.path.join("."),
                message: issue.message
            });
        });
    }

    // mongoose error handling
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = "Validation failed"
        const errors = Object.values(err.errors)

        errors.forEach((errorObj: any) => errorSource.push({
            path: errorObj.path,
            message: errorObj.message
        }))


        message = "Validation failed"

    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}