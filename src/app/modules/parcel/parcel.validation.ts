import z from "zod";






export const parcelValidationZodSchema = z.object({
  parcelType: z.string().min(1, "Parcel type is required"),
  weight: z.number().positive("Weight must be a positive number"),
  deliveryFee: z.number().min(50, "Delivery fee must be at least 50"),
  deliveryDate: z.coerce.date(),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  senderInfo: z.string().min(1, "Sender ID is required"),
  receiverInfo: z.string().min(1, "Receiver ID is required"),

})