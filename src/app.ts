import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import { userRoutes } from "./app/modules/user/user.router"


export const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.use('/api/v1/user', userRoutes)


app.get('/', (req:Request, res:Response)=>{

    res.send("Hi! world!")
})


