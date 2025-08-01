/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum ParcelStatus {
    REQUESTED = "Requested",
    APPROVED = "Approved",
    DISPATCHED = 'Dispatched',
    IN_TRANSIT = 'In Transit',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
    BLOCKED = "Blocked",         
    RETURNED = "Returned",       
    RESCHEDULED = "Rescheduled"
}


export interface IParcelStatusLog {
    status: ParcelStatus,
    location?: string,
    note?: string,
    timestamp: Date,
    updatedBy: Types.ObjectId
}

export interface IParcel {
    trackingId: string,
    type: string,
    weight: number,
    deliveryFee: number,
    deliveryDate: Date,
    deliveryAddress: string,
    senderInfo: Types.ObjectId,
    receiverInfo: Types.ObjectId,
    status: ParcelStatus,
    statusLog: IParcelStatusLog[],
    isConfirmed: boolean,
    isCancelled: boolean,
    isBlocked: boolean
}