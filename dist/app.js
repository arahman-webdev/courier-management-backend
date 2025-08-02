"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_router_1 = require("./app/modules/user/user.router");
const auth_router_1 = require("./app/modules/auth/auth.router");
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const notFound_1 = require("./app/middleware/notFound");
const parcel_router_1 = require("./app/modules/parcel/parcel.router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use('/api/v1/user', user_router_1.userRoutes);
exports.app.use('/api/v1/auth', auth_router_1.authRouter);
exports.app.use('/api/v1/parcels', parcel_router_1.parcelRouter);
exports.app.get('/', (req, res) => {
    res.send("Hi! world!");
});
exports.app.use(globalErrorHandler_1.globalErrorHandler);
exports.app.use(notFound_1.notFound);
