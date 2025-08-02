"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const auth_service_1 = require("./auth.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const setCookies_1 = require("../../utills/setCookies");
const credentialsLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginInfo = yield auth_service_1.authService.credentialsLoginService(req.body);
        (0, setCookies_1.setAuthCookie)(res, loginInfo);
        res.status(200).json({
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Logged In Successfully",
            data: loginInfo,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
const getNewAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token recieved from cookies");
        }
        const tokenInfo = yield auth_service_1.authService.getNewAccessToken(refreshToken);
        (0, setCookies_1.setAuthCookie)(res, tokenInfo);
        res.status(200).json({
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Logged In Successfully",
            data: tokenInfo,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
// logout only below and router.post('/logout', controler.logut)
const logoutUser = (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });
    res.status(http_status_codes_1.default.OK).json({
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User logged out successfully",
        data: null
    });
};
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logoutUser
};
