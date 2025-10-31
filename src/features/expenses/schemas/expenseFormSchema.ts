import { z } from "zod";

const SplitTypes = ["even", "percentage", "shares", "custom"] as const;

// Shared validation logic for split totals
const validateSplitTotals = (
  data: {
    splitType: string;
    memberSplits: { weight: number }[];
    amount: number;
  },
  ctx: z.RefinementCtx,
  path: string[] = ["splitType"]
) => {
  const { splitType, memberSplits, amount } = data;

  const total = memberSplits.reduce((sum, member) => sum + member.weight, 0);

  if (splitType === "percentage" && total !== 100) {
    ctx.addIssue({
      path,
      code: z.ZodIssueCode.custom,
      message: "Percentage splits must add up to 100%",
    });
  }

  if (splitType === "custom" && total !== amount) {
    ctx.addIssue({
      path,
      code: z.ZodIssueCode.custom,
      message: "Custom splits must add up to the total amount",
    });
  }
};

export const ExpenseFormSchema = () =>
  z
    .object({
      amount: z.number().positive("Amount cannot be 0"),
      title: z.string().min(1, "Title cannot be empty"),
      paidBy: z.string().uuid(),
      date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
      category: z.string().uuid().optional(),
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
    .superRefine((data, ctx) => validateSplitTotals(data, ctx));

const ItemSchema = z
  .object({
    title: z.string().min(1, "Item title cannot be empty"),
    amount: z.number().positive("Item amount must be greater than 0"),
    splitType: z.enum(SplitTypes),
    memberSplits: z
      .array(
        z.object({
          userId: z.string(),
          weight: z.number({ invalid_type_error: "" }).min(0),
        })
      )
      .min(1, "At least one member must be selected for this item."),
    selectedMembers: z.array(z.string()).refine((arr) => arr.length > 0, {
      message: "At least one member must be selected",
    }),
  })
  .superRefine((data, ctx) => validateSplitTotals(data, ctx));

export const MultiItemExpenseFormSchema = () =>
  z.object({
    title: z.string().min(1, "Title cannot be empty"),
    paidBy: z.string().uuid(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    category: z.string().uuid().optional(),
    items: z.array(ItemSchema).min(1, "At least one item is required"),
  });
