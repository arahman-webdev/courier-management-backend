"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.parcelService = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const user_interface_1 = require("../user/user.interface");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const QueryBuilder_1 = require("../../utills/QueryBuilder");
const getTrackingId = () => {
    return `TRA_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
/**--------------------------------------------Sender Or Admin */
const createParcelService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = getTrackingId();
    console.log(trackingId);
    const createParcel = yield parcel_model_1.Parcel.create([Object.assign(Object.assign({}, payload), { trackingId })]);
    console.log(createParcel);
    return createParcel;
});
const caneclParcelService = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(403, "Parcel is not");
    }
    if (parcel.status === parcel_interface_1.ParcelStatus.DISPATCHED ||
        parcel.status === parcel_interface_1.ParcelStatus.IN_TRANSIT ||
        parcel.status === parcel_interface_1.ParcelStatus.DELIVERED ||
        parcel.status === parcel_interface_1.ParcelStatus.CANCELLED) {
        throw new AppError_1.default(400, `Parcel cannot be cancelled at status: ${parcel.status}`);
    }
    const updateParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, {
        $set: {
            status: parcel_interface_1.ParcelStatus.CANCELLED,
            isCancelled: true
        },
        $push: {
            status: parcel_interface_1.ParcelStatus.CANCELLED,
            timestamp: new Date(),
            updatedBy: userId,
            note: "Cancelled by Sender"
        }
    });
    return updateParcel;
});
// Sender or receiver can check 
const getParcelService = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {};
    if (role === user_interface_1.Role.RECEIVER) {
        query = { receiverInfo: userId };
    }
    else if (role === user_interface_1.Role.SENDER) {
        query = { senderInfo: userId };
    }
    else {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Access denied");
    }
    const parcel = yield parcel_model_1.Parcel.find(query).populate('senderInfo', 'name email').populate("receiverInfo");
    if (!parcel.length) {
        throw new AppError_1.default(404, `No parcels found for this user`);
    }
    return parcel;
});
const updateParcelStatusService = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found.");
    }
    const currentStatus = parcel.status;
    const statusFlow = [
        parcel_interface_1.ParcelStatus.REQUESTED,
        parcel_interface_1.ParcelStatus.APPROVED,
        parcel_interface_1.ParcelStatus.DISPATCHED,
        parcel_interface_1.ParcelStatus.IN_TRANSIT,
        parcel_interface_1.ParcelStatus.DELIVERED
    ];
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[currentIndex + 1];
    if (currentIndex === -1 || !nextStatus) {
        throw new AppError_1.default(400, "Cannot update status any longer");
    }
    // Update parcel
    parcel.status = nextStatus;
    parcel.statusLog.push({
        status: nextStatus,
        timestamp: new Date(),
        updatedBy: new mongoose_1.Types.ObjectId(userId),
        note: `Status updated to ${nextStatus}`
    });
    const updatedParcel = yield parcel.save();
    return updatedParcel;
});
const updateConfirmation = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (parcel.status !== parcel_interface_1.ParcelStatus.IN_TRANSIT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "If parcels in 'In-Transit' can be confirmed");
    }
    const update = yield parcel_model_1.Parcel.findByIdAndUpdate(id, {
        $set: {
            status: parcel_interface_1.ParcelStatus.DELIVERED,
            isConfirmed: true
        },
        $push: {
            statusLog: {
                status: parcel_interface_1.ParcelStatus.DELIVERED,
                timestamp: new Date(),
                updatedBy: userId,
                note: "Confirmed by Receiver"
            }
        }
    });
    return update;
});
// admin sender or receiver can check 
const trackParcelByTrackingIdService = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId })
        .populate("senderInfo", "name email")
        .populate("receiverInfo", "name email")
        .populate("statusLog.updatedBy", "name role email");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found with this tracking ID");
    }
    return parcel;
});
// only admin
const blockParcel = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    const blockableStatuses = [
        parcel_interface_1.ParcelStatus.REQUESTED,
        parcel_interface_1.ParcelStatus.APPROVED,
        parcel_interface_1.ParcelStatus.DISPATCHED,
        parcel_interface_1.ParcelStatus.IN_TRANSIT,
        parcel_interface_1.ParcelStatus.RESCHEDULED
    ];
    if (!blockableStatuses.includes(parcel.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcels can only be blocked in these statuses: ${blockableStatuses.join(', ')}`);
    }
    if (parcel.isBlocked || parcel.status === parcel_interface_1.ParcelStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel is already blocked");
    }
    const update = yield parcel_model_1.Parcel.findByIdAndUpdate(id, {
        $set: {
            status: parcel_interface_1.ParcelStatus.BLOCKED,
            isBlocked: true
        },
        $push: {
            statusLog: {
                status: parcel_interface_1.ParcelStatus.BLOCKED,
                timestamp: new Date(),
                updatedBy: userId,
                note: "Blocked by Admin"
            }
        }
    });
    console.log("from block", update);
    return update;
});
const getParcelLogInfo = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId)
        .populate("statusLog.updatedBy", "name role email")
        .populate("senderInfo", "id")
        .populate("senderInfo", "id");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel is not found");
    }
    return parcel;
});
// only admin -------------------
const getAllParcels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelsQuery = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), query);
    const allParcels = yield parcelsQuery
        .filter()
        .search(['trackingId', 'deliveryAddress'])
        .sort()
        .select()
        .paginate()
        .modelQuery;
    console.log(allParcels);
    const meta = yield parcelsQuery.getMeta();
    return { allParcels, meta };
});
// only admin-------------
const unblockParcel = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel)
        throw new AppError_1.default(404, "Parcel not found");
    if (!parcel.isBlocked)
        throw new AppError_1.default(400, "Parcel is not blocked");
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, {
        status: parcel_interface_1.ParcelStatus.REQUESTED,
        isBlocked: false,
        $push: {
            statusLogs: {
                status: parcel_interface_1.ParcelStatus.IN_TRANSIT,
                updatedBy: userId,
                note: "Unblocked by Admin",
                timestamp: new Date(),
            },
        },
    }, { new: true });
    return updatedParcel;
});
// admin or sender------------------
const returnParcel = (id, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (parcel.status !== parcel_interface_1.ParcelStatus.IN_TRANSIT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only IN_TRANSIT parcels can be returned");
    }
    const updated = yield parcel_model_1.Parcel.findByIdAndUpdate(id, {
        status: parcel_interface_1.ParcelStatus.RETURNED,
        $push: {
            statusLogs: {
                status: parcel_interface_1.ParcelStatus.RETURNED,
                updatedBy: userId,
                note: `${role} marked as returned`,
                timestamp: new Date(),
            },
        },
    }, { new: true });
    return updated;
});
// only admin or sender
const deleteParcel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (![parcel_interface_1.ParcelStatus.CANCELLED, parcel_interface_1.ParcelStatus.REQUESTED].includes(parcel.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only CANCELLED or REQUESTED parcels can be deleted");
    }
    const deleteParcel = yield parcel_model_1.Parcel.findByIdAndDelete(id);
    return deleteParcel;
});
// const rescheduleParcel = async (id: string,newDate: Date,userId: string) => {
//     const parcel = await Parcel.findById(id);
//     if (!parcel) throw new AppError(statusCode.NOT_FOUND, "Parcel not found");
//     parcel.deliveryDate = newDate;
//     parcel.status = ParcelStatus.RESCHEDULED;
//     parcel.statusLog.push({
//         status: ParcelStatus.RESCHEDULED,
//         timestamp: new Date(),
//         updatedBy: new Types.ObjectId(userId),
//         note: `Rescheduled to ${newDate.toISOString()}`
//     });
//     await parcel.save();
//     return parcel;
// };
exports.parcelService = {
    createParcelService,
    getParcelService,
    caneclParcelService,
    updateParcelStatusService,
    updateConfirmation,
    blockParcel,
    getParcelLogInfo,
    getAllParcels,
    unblockParcel,
    returnParcel,
    deleteParcel,
    trackParcelByTrackingIdService
};
/**
 *

L



 Filter & Search for Sender/Receiver
e.g., GET /parcels?status=DELIVERED




 */ 
