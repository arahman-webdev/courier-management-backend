import { model, Schema } from "mongoose";
import { IParcel, IParcelStatusLog, ParcelStatus } from "./parcel.interface";


const parcelStatusSchema = new Schema<IParcelStatusLog>({
        status: {
            type: String,
            enum: Object.values(ParcelStatus),
            required: true
        },
        location: {type:String},
        note: {type: String},
        timestamp: {type: Date, default: Date.now},
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
}, {_id: false, versionKey: false})


const parcelSchema = new Schema<IParcel>({
        trackingId:{
            type: String,
            required: true,
            unique: true
        },
        parcelType:{
            type: String,
            required: true
        },
        weight: {type: Number, required: true},
        deliveryFee: {type: Number, required: true},
        deliveryDate: {type: Date, required: true},
        deliveryAddress: {type: String, required: true},
        senderInfo: {type: Schema.Types.ObjectId, ref: "User", required: true},
        receiverInfo: {type: Schema.Types.ObjectId, ref: "User", required: true},
        isConfirmed: {type: Boolean, default: false},
        isCancelled: {type: Boolean, default: false},
        isBlocked: {type: Boolean, default: false},
        status: {
            type: String,
            default: ParcelStatus.REQUESTED
        },
        statusLog: {
            type: [parcelStatusSchema],
          
            default: []
        }
},{timestamps: true, versionKey: false})


export const Parcel = model<IParcel>('Parcel', parcelSchema)