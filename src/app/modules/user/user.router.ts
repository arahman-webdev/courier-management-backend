import express from "express"

import { UserController } from "./user.controller"

const router = express.Router()



router.post('/register', UserController.createUser)

router.get('/', UserController.getAllUsers)

router.patch('/:id', UserController.updateUser)

export const userRoutes = router 