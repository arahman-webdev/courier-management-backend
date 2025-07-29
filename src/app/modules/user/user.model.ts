import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";


const authShema = new Schema<IAuthProvider>({
    provider: {type: String},
    providerId: {type: String}
},{
    _id: false,
    versionKey: false
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    role: {
        type: String,
        enum: Object.values(Role)
    },
    photo: { type: String },
    address: { type: String },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    isVerified: {type: Boolean, default: false},
    auth: [authShema]
},{
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", userSchema)