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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const userTokens_1 = require("../../utills/userTokens");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const credentialsLoginService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isExistUser = yield user_model_1.User.findOne({ email });
    if (!isExistUser) {
        throw new Error("Email does not exist");
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, isExistUser.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect Password");
    }
    const userToken = (0, userTokens_1.createUserToken)(isExistUser);
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const _a = isExistUser.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
});
exports.authService = {
    credentialsLoginService,
    getNewAccessToken
};
