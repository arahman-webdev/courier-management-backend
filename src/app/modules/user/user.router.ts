import express from "express"
import { userSerivice } from "./user.service"

const router = express.Router()



router.post('/register', userSerivice.createUserService)





export const userRoutes = router 