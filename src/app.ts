import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import { userRoutes } from "./app/modules/user/user.router"
import { authRouter } from "./app/modules/auth/auth.router"
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"
import { notFound } from "./app/middleware/notFound"
import { parcelRouter } from "./app/modules/parcel/parcel.router"


export const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/parcels', parcelRouter)


app.get('/', (req:Request, res:Response)=>{

    res.send("Hi! world!")
})


app.use(globalErrorHandler)

app.use(notFound)

