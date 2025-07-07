import { z } from "zod";

export const SettlementFormSchema = () =>
  z.object({
    title: z.string().min(1, "Title cannot be empty"),
    selectedExpenseIds: z.array(z.string().uuid().min(1)),
  });
