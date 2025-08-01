import { NextFunction, Request, Response } from "express";
import { parcelService } from "./parcel.service";

const createParcel = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const parcel = await parcelService.createParcelService(req.body)

        res.json({
            success: true,
            message: "Parcel created sucessfully",
            data: parcel
        })
    } catch (error) {
        next(error)
    }
}

const getMyParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.userId
        console.log(userId)
        const role = req.user.userRole
        console.log(role)
        const parcel = await parcelService.getParcelService(userId, role)

        res.json({
            success: true,
            message: "Parcel retreived sucessfully",
            data: parcel
        })
    } catch (error) {
        next(error)
    }
}

const updateParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parcelId = req.params.id;
        const userId = req.user.userId
        const parcel = await parcelService.updateParcelService(parcelId, userId)

        res.json({
            success: true,
            message: "Parcel updated sucessfully",
            data: parcel
        })
    } catch (error) {
        next(error)
    }
}


const updateParcelStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parcelId = req.params.id;
        const userId = req.user.userId
        const parcel = await parcelService.updateParcelStatusService(parcelId, userId)

        res.json({
            success: true,
            message: "Parcel updated sucessfully",
            data: parcel
        })
    } catch (error) {
        next(error)
    }
}
const updateParcelConfirmation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parcelId = req.params.id;
        const userId = req.user.userId
        const parcel = await parcelService.updateConfirmation(parcelId, userId)

        res.json({
            success: true,
            message: "Parcel confirmed sucessfully",
            data: parcel
        })
    } catch (error) {
        next(error)
    }
}


export const parcelController = {
    createParcel,
    getMyParcel,
    updateParcel,
    updateParcelStatus,
    updateParcelConfirmation
}