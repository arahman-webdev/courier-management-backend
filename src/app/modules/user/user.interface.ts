/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER"
}

export enum UserStatus {

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
    isActive?: UserStatus,
    isVerified?: boolean,
    auth?: IAuthProvider[]
}