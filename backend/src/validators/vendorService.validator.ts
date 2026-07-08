import { z } from "zod";

export const createVendorServiceSchema = z.object({

  vendorId: z.string(),

  category: z.enum([
    "VENUE",
    "CATERING",
    "PHOTOGRAPHY",
    "VIDEOGRAPHY",
    "DECORATION",
    "MAKEUP",
    "MUSIC",
    "DJ",
    "TRANSPORT",
    "INVITATION",
    "EVENT_PLANNER",
    "OTHERS"
  ]),

  title: z.string().min(3),

  description: z.string().optional(),

  basePrice: z.number().positive(),

  minGuests: z.number().int().positive().optional(),

  maxGuests: z.number().int().positive().optional(),

  supportedEvents: z.array(

    z.enum([
      "WEDDING",
      "BIRTHDAY",
      "GRADUATION",
      "BABY_SHOWER",
      "RITUAL",
      "CORPORATE",
      "ENGAGEMENT",
      "ANNIVERSARY"
    ])

  )

});