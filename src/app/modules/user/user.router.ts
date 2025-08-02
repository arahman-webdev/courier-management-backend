import express from "express"

import { UserController } from "./user.controller"
import { checkAuth } from "../../middleware/checkAuth"
import { Role } from "./user.interface"


const router = express.Router()



router.post('/register',  UserController.createUser)

router.get('/', checkAuth((Role.ADMIN)),UserController.getAllUsers)

router.patch('/:id',checkAuth(...Object.values(Role)), UserController.updateUser)
router.patch('/block/:id',checkAuth(Role.ADMIN),  UserController.blockOrUnblock)



export const userRoutes = router 