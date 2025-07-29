import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'


export const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.get('/', (req:Request, res:Response)=>{

    res.send("Hi! world!")
})


