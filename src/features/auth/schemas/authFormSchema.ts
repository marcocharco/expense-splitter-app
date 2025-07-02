import { z } from "zod";

export const authFormSchema = (type: "sign-in" | "sign-up") =>
  z.object({
    name: type === "sign-in" ? z.string().optional() : z.string().max(255),
    email: z.string().email().max(255),
    password: type === "sign-in" ? z.string() : z.string().min(8),
  });
