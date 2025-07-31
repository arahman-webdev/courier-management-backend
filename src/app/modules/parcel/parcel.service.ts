import AppError from "../../errorHelper/AppError";
import { Role } from "../user/user.interface";
import { IParcel } from "./parcel.interface";
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

const updateParcelService = async(id:string,userId: string, payload: Partial<IParcel>)=>{

    const parcel = await Parcel.findById(id)

    if(!parcel){
        throw new AppError(404, "Parcel is not found")
    }

    if(parcel.senderInfo.toString() !== userId){
        throw new AppError(403, "You are not allowed to cancel this parcel")
    }

    const cancelParcel = await Parcel.findByIdAndUpdate(id, payload, {new: true, runValidators: true})

    return cancelParcel
}


export const parcelService = {
    createParcelService,
    getParcelService,
    updateParcelService
}