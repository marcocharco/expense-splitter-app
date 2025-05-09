import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: string) =>
  z.object({
    name: type === "sign-in" ? z.string().optional() : z.string().max(255),
    email: z.string().email().max(255),
    password: type === "sign-in" ? z.string() : z.string().min(8),
  });
