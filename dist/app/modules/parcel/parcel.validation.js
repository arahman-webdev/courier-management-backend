"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelValidationZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.parcelValidationZodSchema = zod_1.default.object({
    parcelType: zod_1.default.string().min(1, "Parcel type is required"),
    weight: zod_1.default.number().positive("Weight must be a positive number"),
    deliveryFee: zod_1.default.number().min(50, "Delivery fee must be at least 50"),
    deliveryDate: zod_1.default.coerce.date(),
    deliveryAddress: zod_1.default.string().min(1, "Delivery address is required"),
    senderInfo: zod_1.default.string().min(1, "Sender ID is required"),
    receiverInfo: zod_1.default.string().min(1, "Receiver ID is required"),
});
