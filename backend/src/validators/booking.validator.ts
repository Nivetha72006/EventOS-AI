import { z } from "zod";

export const createBookingSchema = z.object({

  userId: z.string(),

  eventId: z.string(),

  vendorId: z.string(),

  serviceId: z.string(),

  notes: z.string().optional()

});