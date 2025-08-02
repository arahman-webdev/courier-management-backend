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
exports.userSerivice = void 0;
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("./user.interface");
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isExistingUser = yield user_model_1.User.findOne({ email });
    if (isExistingUser) {
        throw new Error("Email already exist");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUNDS));
    console.log(hashPassword);
    const authProvider = { provider: "credential", providerId: email };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, auth: [authProvider] }, rest));
    return user;
});
const getAllUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const getAllUsers = yield user_model_1.User.find();
    return getAllUsers;
});
const updateUserService = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findById(userId);
    if (!isUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // Normal users cannot update others
    if (decodedToken.userRole === user_interface_1.Role.SENDER || decodedToken.userRole === user_interface_1.Role.RECEIVER) {
        if (decodedToken.userId !== userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update this user.");
        }
    }
    // Role update restriction
    if (payload.role) {
        if (decodedToken.userRole === user_interface_1.Role.RECEIVER || decodedToken.userRole === user_interface_1.Role.SENDER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update role.");
        }
        if (payload.role === user_interface_1.Role.ADMIN && decodedToken.userRole === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to set admin role.");
        }
    }
    if (payload.isActive || payload.isVerified) {
        if (decodedToken.userRole === user_interface_1.Role.RECEIVER || decodedToken.userRole === user_interface_1.Role.SENDER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // Hash password if present
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUNDS));
    }
    const updateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return updateUser;
});
const toggleBlockUserService = (userId, block) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    user.isActive = block ? user_interface_1.UserStatus.BLOCKED : user_interface_1.UserStatus.ACTIVE;
    yield user.save();
    return user;
});
exports.userSerivice = {
    createUserService,
    getAllUsersService,
    updateUserService,
    toggleBlockUserService
};
