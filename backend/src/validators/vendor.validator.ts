import { z } from "zod";

export const createVendorSchema = z.object({

  ownerId: z.string(),

  businessName: z.string().min(3),

  description: z.string().optional(),

  experience: z.number().optional(),

  city: z.string(),

  state: z.string(),

  country: z.string(),

  minimumPrice: z.number().optional(),

  maximumPrice: z.number().optional(),

  phone: z.string().optional(),

  website: z.string().url().optional()

});