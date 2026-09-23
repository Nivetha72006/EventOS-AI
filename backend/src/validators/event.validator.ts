import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Event name must be at least 3 characters"),

  eventType: z.enum([
    "WEDDING",
    "BIRTHDAY",
    "GRADUATION",
    "BABY_SHOWER",
    "RITUAL",
    "CORPORATE",
    "ENGAGEMENT",
    "ANNIVERSARY",
  ]),

  eventDate: z.string().datetime(),

  city: z.string().min(2, "City is required"),

  state: z.string().min(2, "State is required"),

  country: z.string().min(2, "Country is required"),

  guestCount: z.number().int().positive().optional(),

  budget: z.number().positive().optional(),

  description: z.string().optional(),

  theme: z.string().optional(),

  preferredColors: z.any().optional(),

  requirements: z.array(z.string()).optional(),
});