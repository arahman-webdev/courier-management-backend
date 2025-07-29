/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECIEVER = "RECIEVER"
}

export enum IsActive {

    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
    provider: "google" | "credential",
    providerId: string
}


export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password?: string,
    phone?: string,
    role?: Role
    photo?: string,
    address?: string,
    isActive?: IsActive,
    isVerified?: boolean,
    auth?: IAuthProvider
}