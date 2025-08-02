import z from "zod";

export const userValidationZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  isVerified: z.boolean().default(false),
});