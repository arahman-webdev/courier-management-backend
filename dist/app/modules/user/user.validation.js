"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userValidationZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required"),
    email: zod_1.default.string().email("Invalid email"),
    phone: zod_1.default.string().optional(),
    address: zod_1.default.string().optional(),
    isVerified: zod_1.default.boolean().default(false),
});
