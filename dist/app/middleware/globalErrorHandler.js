"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const handleCastError_1 = require("../errors/handleCastError");
const handleDuplicateError_1 = require("../errors/handleDuplicateError");
const env_1 = require("../config/env");
// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    // console.log("Error from error handler", err)
    let statusCode = 500;
    let message = "Something Went Wrong!!";
    const errorSource = [];
    // duplicate error -----------
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // cast error -----------
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Zod error
    else if (err.name === "ZodError") {
        statusCode = 400;
        message = "Zod Error";
        err.issues.forEach((issue) => {
            errorSource.push({
                path: issue.path.join("."),
                message: issue.message
            });
        });
    }
    // mongoose error handling
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = "Validation failed";
        const errors = Object.values(err.errors);
        errors.forEach((errorObj) => errorSource.push({
            path: errorObj.path,
            message: errorObj.message
        }));
        message = "Validation failed";
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        err,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null
    });
};
exports.globalErrorHandler = globalErrorHandler;
