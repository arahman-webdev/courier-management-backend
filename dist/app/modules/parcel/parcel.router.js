"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelRouter = void 0;
const express_1 = __importDefault(require("express"));
const parcel_controller_1 = require("./parcel.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validation_1 = require("../../middleware/validation");
const parcel_validation_1 = require("./parcel.validation");
const router = express_1.default.Router();
router.post('/', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SENDER), (0, validation_1.validateRequest)(parcel_validation_1.parcelValidationZodSchema), parcel_controller_1.parcelController.createParcel);
router.get('/me', (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.RECEIVER), parcel_controller_1.parcelController.getMyParcel);
router.patch('/cancel/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.parcelController.cancelParcel);
router.patch('/status/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.parcelController.updateParcelStatus);
router.patch('/confirm/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.parcelController.updateParcelConfirmation);
router.get('/tracking/:trackingId', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), parcel_controller_1.parcelController.trackParcelByTrackingId);
router.patch('/block/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.parcelController.blockParcel);
router.patch('/unblcok/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.parcelController.unblockParcel);
router.patch('/return/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.RECEIVER), parcel_controller_1.parcelController.returnParcel);
router.delete('/delete/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SENDER), parcel_controller_1.parcelController.deleteParcel);
router.get('/:id/status-log', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), parcel_controller_1.parcelController.getParcelStatusLog);
router.get('/', parcel_controller_1.parcelController.getAllParcels);
// pass: 123456A2a$
exports.parcelRouter = router;
