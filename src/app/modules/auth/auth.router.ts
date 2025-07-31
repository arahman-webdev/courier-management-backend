import express from "express"
import { AuthControllers } from "./auth.controller"



const router = express.Router()

router.post('/login', AuthControllers.credentialsLogin)
router.post('/refresh-token', AuthControllers.getNewAccessToken)


export const authRouter = router