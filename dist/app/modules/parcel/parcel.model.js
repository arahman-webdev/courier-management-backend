"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const parcelStatusSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true
    },
    location: { type: String },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { _id: false, versionKey: false });
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true
    },
    parcelType: {
        type: String,
        required: true
    },
    weight: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    deliveryDate: { type: Date, required: true },
    deliveryAddress: { type: String, required: true },
    senderInfo: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiverInfo: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isConfirmed: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    status: {
        type: String,
        default: parcel_interface_1.ParcelStatus.REQUESTED
    },
    statusLog: {
        type: [parcelStatusSchema],
        default: []
    }
}, { timestamps: true, versionKey: false });
exports.Parcel = (0, mongoose_1.model)('Parcel', parcelSchema);
