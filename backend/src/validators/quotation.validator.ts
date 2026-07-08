import { z } from "zod";

export const createQuotationSchema = z.object({

  bookingId: z.string(),

  vendorId: z.string(),

  amount: z.number().positive(),

  message: z.string().optional(),

  validTill: z.string().datetime().optional()

});