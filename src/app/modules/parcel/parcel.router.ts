import express from "express"
import { parcelController } from "./parcel.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { Role } from "../user/user.interface"

const router = express.Router()


router.post('/', checkAuth(Role.ADMIN, Role.SENDER), parcelController.createParcel)
router.get('/me', checkAuth(Role.SENDER, Role.RECEIVER), parcelController.getMyParcel)
router.patch('/cancel/:id', checkAuth(Role.SENDER), parcelController.updateParcel)
router.patch('/status/:id', checkAuth(Role.ADMIN), parcelController.updateParcelStatus)


// pass: 123456A2a$


export const parcelRouter = router