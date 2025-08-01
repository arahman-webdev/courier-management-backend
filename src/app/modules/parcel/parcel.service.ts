/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";
import AppError from "../../errorHelper/AppError";
import { Role } from "../user/user.interface";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import statusCode from "http-status-codes"

const getTrackingId = () => {
    return `TRA_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const createParcelService = async (payload: IParcel) => {


    const trackingId = getTrackingId()

    console.log(trackingId)

    const createParcel = await Parcel.create([{
        ...payload,
        trackingId

    }])
    console.log(createParcel)
    return createParcel

}

const getParcelService = async (userId: string, role: Role) => {

    let query = {}

    if (role === Role.RECEIVER) {
        query = { receiverInfo: userId }
    } else if (role === Role.SENDER) {
        query = { senderInfo: userId }
    } else {
        throw new AppError(statusCode.BAD_REQUEST, "Access denied")
    }

    const parcel = await Parcel.find(query).populate('senderInfo', 'name email').populate("receiverInfo")



    // Prevent access if no parcels found
    if (!parcel.length) {
        throw new AppError(404, `No parcels found for this user`);
    }

    return parcel
}

const updateParcelService = async (id: string, userId: string) => {

    const parcel = await Parcel.findById(id)

    if (!parcel) {
        throw new AppError(403, "Parcel is not")
    }


    if (
        parcel.status === ParcelStatus.DISPATCHED ||
        parcel.status === ParcelStatus.IN_TRANSIT ||
        parcel.status === ParcelStatus.DELIVERED ||
        parcel.status === ParcelStatus.CANCELLED
    ) {
        throw new AppError(400, `Parcel cannot be cancelled at status: ${parcel.status}`);
    }

    const updateParcel = await Parcel.findByIdAndUpdate(
        id,
        {
            $set: {
                status: ParcelStatus.CANCELLED,
                isCancelled: true
            },

            $push: {
                status: ParcelStatus.CANCELLED,
                timestamp: new Date(),
                updatedBy: userId,
                note: "Cancelled by Sender"
            }
        }
    )

    return updateParcel
}
const updateParcelStatusService = async (id: string, userId: string) => {

    const parcel = await Parcel.findById(id);


    if (!parcel) {
        throw new AppError(404, "Parcel not found.");
    }

    const currentStatus = parcel.status;

    const statusFlow = [
        ParcelStatus.REQUESTED,
        ParcelStatus.APPROVED,
        ParcelStatus.DISPATCHED,
        ParcelStatus.IN_TRANSIT,
        ParcelStatus.DELIVERED
    ];

    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = statusFlow[currentIndex + 1];

    if (currentIndex === -1 || !nextStatus) {
        throw new AppError(400, "Cannot update status any longer");
    }

    // Update parcel
    parcel.status = nextStatus;
    parcel.statusLog.push({
        status: nextStatus,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(userId),
        note: `Status updated to ${nextStatus}`
    });

    const updatedParcel = await parcel.save();

    return updatedParcel;
};


const updateConfirmation = async (id: string, userId: string) => {
    const parcel = await Parcel.findById(id)

    if (!parcel) {
        throw new AppError(statusCode.NOT_FOUND, "Parcel not found")
    }

    if (parcel.status !== ParcelStatus.IN_TRANSIT) {
        throw new AppError(statusCode.BAD_REQUEST, "If parcels in 'In-Transit' can be confirmed")
    }

    const update = await Parcel.findByIdAndUpdate(
        id,

        {
            $set: {
                status: ParcelStatus.DELIVERED,
                isConfirmed: true
            },

            $push: {
                statusLog: {
                    status: ParcelStatus.DELIVERED,
                    timestamp: new Date(),
                    updatedBy: userId,
                    note: "Confirmed by Receiver"
                }
            }
        }
    )

    return update


}
const blockParcel = async (id: string, userId: string) => {
    const parcel = await Parcel.findById(id)

    if (!parcel) {
        throw new AppError(statusCode.NOT_FOUND, "Parcel not found")
    }

    const blockableStatuses: ParcelStatus[] = [
        ParcelStatus.REQUESTED,
        ParcelStatus.APPROVED,
        ParcelStatus.DISPATCHED,
        ParcelStatus.IN_TRANSIT,
        ParcelStatus.RESCHEDULED
    ];

    if (!blockableStatuses.includes(parcel.status)) {
        throw new AppError(statusCode.BAD_REQUEST, `Parcels can only be blocked in these statuses: ${blockableStatuses.join(', ')}`)
    }

    if (parcel.isBlocked || parcel.status === ParcelStatus.BLOCKED) {
        throw new AppError(statusCode.BAD_REQUEST, "Parcel is already blocked")
    }

    const update = await Parcel.findByIdAndUpdate(
        id,

        {
            $set: {
                status: ParcelStatus.BLOCKED,
                isBlocked: true
            },

            $push: {
                statusLog: {
                    status: ParcelStatus.BLOCKED,
                    timestamp: new Date(),
                    updatedBy: userId,
                    note: "Blocked by Admin"
                }
            }
        }
    )

    return update


}

const getParcelLogInfo = async (parcelId: string) => {


    const parcel = await Parcel.findById(parcelId)
        .populate("statusLog.updatedBy", "name role email")
        .populate("senderInfo", "id")
        .populate("senderInfo", "id")



    if (!parcel) {
        throw new AppError(statusCode.NOT_FOUND, "Parcel is not found")
    }

    return parcel
}


// const getAllParcels = async (query: Record<string, string>) => {

//     const filter = query;



//     console.log(query)

//     const filterParcel = await Parcel.find(filter)

//     return filterParcel
// }


// parcel.service.ts
const getAllParcels = async (query: Record<string, string>) => {
    const filter: Record<string, any> = {};


   
    // Add status filter
    if (query.status) {
        filter.status = query.status;
    }

    // Add delivery date range filtering
    if (query.from || query.to) {
        filter.deliveryDate = {};
        if (query.from) {
            filter.deliveryDate.$gte = new Date(query.from);
        }
        if (query.to) {
            filter.deliveryDate.$lte = new Date(query.to);
        }
    }

    // You can add more filters here like senderInfo, receiverInfo, etc.

    const filteredParcels = await Parcel.find(filter)
        .populate('senderInfo', 'name email')
        .populate('receiverInfo', 'name email');

        console.log(filteredParcels)

    return filteredParcels;
};



export const parcelService = {
    createParcelService,
    getParcelService,
    updateParcelService,
    updateParcelStatusService,
    updateConfirmation,
    blockParcel,
    getParcelLogInfo,
    getAllParcels
}





/**
 *  

L



 Filter & Search for Sender/Receiver
e.g., GET /parcels?status=DELIVERED




 */