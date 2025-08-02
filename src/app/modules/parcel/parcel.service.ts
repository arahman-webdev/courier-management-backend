/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";
import AppError from "../../errorHelper/AppError";
import { Role } from "../user/user.interface";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import statusCode from "http-status-codes"
import { QueryBuilder } from "../../utills/QueryBuilder";


const getTrackingId = () => {
    return `TRA_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

/**--------------------------------------------Sender Or Admin */

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

const caneclParcelService = async (id: string, userId: string) => {

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




// Sender or receiver can check 
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




    if (!parcel.length) {
        throw new AppError(404, `No parcels found for this user`);
    }

    return parcel
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

// admin sender or receiver can check 
const trackParcelByTrackingIdService = async (trackingId: string) => {
  const parcel = await Parcel.findOne({ trackingId })
    .populate("senderInfo", "name email")
    .populate("receiverInfo", "name email")
    .populate("statusLog.updatedBy", "name role email");

  if (!parcel) {
    throw new AppError(statusCode.NOT_FOUND, "Parcel not found with this tracking ID");
  }

  return parcel;
};

// only admin
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

    console.log("from block", update)

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

// only admin -------------------
const getAllParcels = async (query: Record<string, string>) => {
    const parcelsQuery = new QueryBuilder<IParcel>(Parcel.find(), query);

    const allParcels = await parcelsQuery
        .filter()
        .search(['trackingId', 'deliveryAddress'])
        .sort()
        .select()
        .paginate()
        .modelQuery;

    console.log(allParcels)



    const meta = await parcelsQuery.getMeta();

    return { allParcels, meta };
};

// only admin-------------
const unblockParcel = async (id: string, userId: string) => {
    const parcel = await Parcel.findById(id);
    if (!parcel) throw new AppError(404, "Parcel not found");

    if (!parcel.isBlocked) throw new AppError(400, "Parcel is not blocked");

    const updatedParcel = await Parcel.findByIdAndUpdate(
        id,
        {
            status: ParcelStatus.REQUESTED,
            isBlocked: false,
            $push: {
                statusLogs: {
                    status: ParcelStatus.IN_TRANSIT,
                    updatedBy: userId,
                    note: "Unblocked by Admin",
                    timestamp: new Date(),
                },
            },
        },
        { new: true }
    );

    return updatedParcel
};


// admin or sender------------------
const returnParcel = async (id: string, userId: string, role: Role) => {
    const parcel = await Parcel.findById(id);
    if (!parcel) throw new AppError(statusCode.NOT_FOUND, "Parcel not found");

    if (parcel.status !== ParcelStatus.IN_TRANSIT) {
        throw new AppError(statusCode.BAD_REQUEST, "Only IN_TRANSIT parcels can be returned");
    }

    const updated = await Parcel.findByIdAndUpdate(
        id,
        {
            status: ParcelStatus.RETURNED,
            $push: {
                statusLogs: {
                    status: ParcelStatus.RETURNED,
                    updatedBy: userId,
                    note: `${role} marked as returned`,
                    timestamp: new Date(),
                },
            },
        },
        { new: true }
    );

    return updated
};

// only admin or sender
const deleteParcel = async (id: string) => {
    const parcel = await Parcel.findById(id);
    if (!parcel) throw new AppError(statusCode.NOT_FOUND, "Parcel not found");

    if (
        ![ParcelStatus.CANCELLED, ParcelStatus.REQUESTED].includes(parcel.status)
    ) {
        throw new AppError(
            statusCode.BAD_REQUEST,
            "Only CANCELLED or REQUESTED parcels can be deleted"
        );
    }

    const deleteParcel = await Parcel.findByIdAndDelete(id);


    return deleteParcel
};

const rescheduleParcel = async (id: string,newDate: Date,userId: string) => {
    const parcel = await Parcel.findById(id);
    if (!parcel) throw new AppError(statusCode.NOT_FOUND, "Parcel not found");

    parcel.deliveryDate = newDate;
    parcel.status = ParcelStatus.RESCHEDULED;
    parcel.statusLog.push({
        status: ParcelStatus.RESCHEDULED,
        timestamp: new Date(),
        updatedBy: new Types.ObjectId(userId),
        note: `Rescheduled to ${newDate.toISOString()}`
    });

    await parcel.save();
    return parcel;
};





export const parcelService = {
    createParcelService,
    getParcelService,
    caneclParcelService,
    updateParcelStatusService,
    updateConfirmation,
    blockParcel,
    getParcelLogInfo,
    getAllParcels,
    unblockParcel,
    returnParcel,
    deleteParcel,
    trackParcelByTrackingIdService,
    rescheduleParcel
}





/**
 *  

L



 Filter & Search for Sender/Receiver
e.g., GET /parcels?status=DELIVERED




 */