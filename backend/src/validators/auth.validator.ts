import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),

  email: z.email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["USER", "VENDOR"]),

  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});