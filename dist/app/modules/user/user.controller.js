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
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userSerivice.createUserService(req.body);
        res.json({
            success: true,
            messge: "User created successfully",
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUsers = yield user_service_1.userSerivice.getAllUsersService();
        res.json({
            success: true,
            message: "User retreived succssfully",
            data: getUsers
        });
    }
    catch (error) {
        next(error);
    }
});
const blockOrUnblock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetUserId = req.params.id; // ID of the user to be blocked/unblocked
        const { block } = req.body; // true to block, false to unblock
        if (typeof block !== "boolean") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "`block` must be a boolean");
        }
        const updatedUser = yield user_service_1.userSerivice.toggleBlockUserService(targetUserId, block);
        res.status(200).json({
            success: true,
            message: `User ${block ? "blocked" : "unblocked"} successfully`,
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const payload = req.body;
        const decodedToken = req.user;
        const updateUser = yield user_service_1.userSerivice.updateUserService(userId, payload, decodedToken);
        res.json({
            success: true,
            message: "User updated succssfully",
            data: updateUser
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.UserController = {
    createUser,
    getAllUsers,
    updateUser,
    blockOrUnblock,
};
