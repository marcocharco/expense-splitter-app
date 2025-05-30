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

export const ExpenseFormSchema = () =>
  z
    .object({
      amount: z.number().positive("Amount cannot be 0"),
      title: z.string().min(1, "Title cannot be empty"),
      paidBy: z.string().uuid(),
      date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
      category: z.number().optional(),
      splitType: z.enum(SplitTypes),
      memberSplits: z
        .array(
          z.object({
            userId: z.string(),
            weight: z.number({ invalid_type_error: "" }).min(0),
          })
        )
        .min(1, "At least one member must be selected."),
      selectedMembers: z.array(z.string()).refine((arr) => arr.length > 0, {
        message: "At least one member must be selected",
      }),
    })
    .superRefine((data, ctx) => {
      const { splitType, memberSplits } = data;

      const total = memberSplits.reduce(
        (sum, member) => sum + member.weight,
        0
      );

      if (splitType === "percentage" && total !== 100) {
        ctx.addIssue({
          path: ["splitType"],
          code: z.ZodIssueCode.custom,
          message: "Percentage splits must add up to 100%",
        });
      }

      if (splitType === "custom" && total !== data.amount) {
        ctx.addIssue({
          path: ["splitType"],
          code: z.ZodIssueCode.custom,
          message: "Custom splits must add up to the total amount",
        });
      }
    });
