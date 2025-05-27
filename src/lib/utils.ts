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

const SplitTypes = ["even", "percentage", "shares", "custom"] as const;

export const newExpenseFormSchema = () =>
  z.object({
    amount: z.number().positive("Amount cannot be 0"),
    title: z.string().min(1, "Title cannot be empty"),
    paidBy: z.string().uuid(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    category: z.string().optional(),
    splitType: z.enum(SplitTypes),
    memberSplits: z
      .array(
        z.object({
          userId: z.string(),
          split: z.number().min(0),
        })
      )
      .nonempty(),
    selectedMembers: z.array(z.string()).refine((arr) => arr.length > 0, {
      message: "At least one member must be selected",
    }),
  });
