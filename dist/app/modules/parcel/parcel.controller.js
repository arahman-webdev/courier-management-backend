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
exports.parcelController = void 0;
const parcel_service_1 = require("./parcel.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcel = yield parcel_service_1.parcelService.createParcelService(req.body);
        res.json({
            success: true,
            message: "Parcel created sucessfully",
            data: parcel
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        console.log(userId);
        const role = req.user.userRole;
        console.log(role);
        const parcel = yield parcel_service_1.parcelService.getParcelService(userId, role);
        res.json({
            success: true,
            message: "Parcel retreived sucessfully",
            data: parcel
        });
    }
    catch (error) {
        next(error);
    }
});
const cancelParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        const userId = req.user.userId;
        const parcel = yield parcel_service_1.parcelService.caneclParcelService(parcelId, userId);
        res.json({
            success: true,
            message: "Parcel updated sucessfully",
            data: parcel
        });
    }
    catch (error) {
        next(error);
    }
});
const updateParcelStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        const userId = req.user.userId;
        const parcel = yield parcel_service_1.parcelService.updateParcelStatusService(parcelId, userId);
        res.json({
            success: true,
            message: "Parcel updated sucessfully",
            data: parcel
        });
    }
    catch (error) {
        next(error);
    }
});
const updateParcelConfirmation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        const userId = req.user.userId;
        const parcel = yield parcel_service_1.parcelService.updateConfirmation(parcelId, userId);
        res.json({
            success: true,
            message: "Parcel confirmed sucessfully",
            data: parcel
        });
    }
    catch (error) {
        next(error);
    }
});
const blockParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        const userId = req.user.userId;
        const parcel = yield parcel_service_1.parcelService.blockParcel(parcelId, userId);
        res.json({
            success: true,
            message: "Parcel blocked sucessfully",
            data: parcel
        });
    }
    catch (error) {
        next(error);
    }
});
const getParcelStatusLog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        console.log(parcelId);
        const parcelLogInfo = yield parcel_service_1.parcelService.getParcelLogInfo(parcelId);
        res.json({
            success: true,
            message: "Parcel logInfo retreived sucessfully",
            data: parcelLogInfo
        });
    }
    catch (error) {
        next(error);
    }
});
const unblockParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        const userId = req.user._id;
        console.log(parcelId);
        const unblockParcel = yield parcel_service_1.parcelService.unblockParcel(parcelId, userId);
        res.json({
            success: true,
            message: "Parcel unblocked sucessfully",
            data: unblockParcel
        });
    }
    catch (error) {
        next(error);
    }
});
const returnParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.userRole;
        const returned = yield parcel_service_1.parcelService.returnParcel(parcelId, userId, userRole);
        res.json({
            success: true,
            message: "Parcel returned sucessfully",
            data: returned
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelId = req.params.id;
        console.log("from parce controller", parcelId);
        const deleted = yield parcel_service_1.parcelService.deleteParcel(parcelId);
        console.log(deleted);
    }
    catch (error) {
        next(error);
    }
});
const getAllParcels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const parcel = yield parcel_service_1.parcelService.getAllParcels(query);
        res.json({
            success: true,
            message: "Parcel retreived sucessfully",
            data: parcel.allParcels,
            meta: parcel.meta
        });
    }
    catch (error) {
        next(error);
    }
});
const trackParcelByTrackingId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackingId } = req.params;
        const parcel = yield parcel_service_1.parcelService.trackParcelByTrackingIdService(trackingId);
        res.status(http_status_codes_1.default.OK).json({
            success: true,
            message: "Parcel tracked successfully",
            data: parcel,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.parcelController = {
    createParcel,
    getMyParcel,
    cancelParcel,
    updateParcelStatus,
    updateParcelConfirmation,
    blockParcel,
    getParcelStatusLog,
    getAllParcels,
    unblockParcel,
    returnParcel,
    deleteParcel,
    trackParcelByTrackingId
};
