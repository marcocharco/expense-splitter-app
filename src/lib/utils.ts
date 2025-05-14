import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authFormSchema = (type: "sign-in" | "sign-up") =>
  z.object({
    name: type === "sign-in" ? z.string().optional() : z.string().max(255),
    email: z.string().email().max(255),
    password: type === "sign-in" ? z.string() : z.string().min(8),
  });

const SplitTypes = ["Even", "Percentage", "Shares", "Custom"] as const;

export const newExpenseFormSchema = () =>
  z.object({
    amount: z
      .number({ invalid_type_error: "Amount is required" })
      .positive("Amount must be greater than zero"),
    title: z.string().min(1),
    paid_by: z.string(),
    date: z.string(),
    category: z.string().optional(),
    split_type: z.enum(SplitTypes),
  });
