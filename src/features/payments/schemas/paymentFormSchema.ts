import { z } from "zod";

export const PaymentFormSchema = () =>
  z.object({
    amount: z.number().positive("Amount cannot be 0"),
    paidTo: z.string().uuid(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    note: z.string().optional(),
  });
