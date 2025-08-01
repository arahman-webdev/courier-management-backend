
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

    const statuses = [
        ParcelStatus.REQUESTED,
        ParcelStatus.APPROVED,
        ParcelStatus.DISPATCHED,
        ParcelStatus.IN_TRANSIT,
        ParcelStatus.DELIVERED
    ];

    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[currentIndex + 1];

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

    if(parcel.status !== ParcelStatus.IN_TRANSIT){
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


export const parcelService = {
    createParcelService,
    getParcelService,
    updateParcelService,
    updateParcelStatusService,
    updateConfirmation
}



/**
 *  3. Confirm Delivery (📥 Receiver Only)
Endpoint: PATCH /parcels/confirm/:id

Logic:

Receiver confirms delivery → update status to DELIVERED.

✅ 4. Admin: View All Parcels & Users
Endpoints:

GET /admin/parcels

GET /admin/users

With filters like:

Status: /admin/parcels?status=IN_TRANSIT

User: /admin/parcels?user=userid

✅ 5. Public Tracking Endpoint (🔍 Optional)
Endpoint: GET /tracking/:trackingId

Anyone can view parcel tracking history by its ID.

✅ 6. Block/Unblock Parcel or User (🔒 Admin)
Endpoints:

PATCH /admin/parcels/block/:id

PATCH /admin/users/block/:id

Admin sets isBlocked flag.

✅ 7. Filter & Search for Sender/Receiver
e.g., GET /parcels?status=DELIVERED

Useful for dashboard/frontend filtering.


 */