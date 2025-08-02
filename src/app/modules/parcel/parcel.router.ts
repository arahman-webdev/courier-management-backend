import express from "express"
import { parcelController } from "./parcel.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { Role } from "../user/user.interface"
import { validateRequest } from "../../middleware/validation"
import { parcelValidationZodSchema } from "./parcel.validation"

const router = express.Router()


router.post('/', checkAuth(Role.ADMIN, Role.SENDER), validateRequest(parcelValidationZodSchema) , parcelController.createParcel)
router.get('/me', checkAuth(Role.SENDER, Role.RECEIVER), parcelController.getMyParcel)
router.patch('/cancel/:id', checkAuth(Role.SENDER), parcelController.updateParcel)
router.patch('/status/:id', checkAuth(Role.ADMIN), parcelController.updateParcelStatus)
router.patch('/confirm/:id', checkAuth(Role.RECEIVER), parcelController.updateParcelConfirmation)
router.patch('/block/:id', checkAuth(Role.ADMIN), parcelController.blockParcel)
router.patch('/unblcok/:id', checkAuth(Role.ADMIN), parcelController.unblockParcel)
router.patch('/return/:id', checkAuth(Role.ADMIN, Role.RECEIVER), parcelController.returnParcel)
router.delete('/delete/:id', checkAuth(Role.ADMIN, Role.SENDER), parcelController.deleteParcel)
router.get('/:id/status-log', checkAuth(...Object.values(Role)), parcelController.getParcelStatusLog)
router.get('/', parcelController.getAllParcels)


// pass: 123456A2a$


export const parcelRouter = router