import { JwtPayload } from "jsonwebtoken";

// creating custom gloabal express in the app folder

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
}