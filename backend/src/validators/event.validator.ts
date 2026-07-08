import { z } from "zod";

export const createEventSchema = z.object({

  title: z.string().min(3),

  eventType: z.enum([
    "WEDDING",
    "BIRTHDAY",
    "GRADUATION",
    "BABY_SHOWER",
    "RITUAL",
    "CORPORATE",
    "ENGAGEMENT",
    "ANNIVERSARY"
  ]),

  eventDate: z.string().datetime(),

  city: z.string().min(2),

  state: z.string().min(2),

  country: z.string().min(2),

  guestCount: z.number().int().positive(),

  budget: z.number().positive().optional(),

  description: z.string().optional(),

  theme: z.string().optional(),

  preferredColors: z.any().optional()

});