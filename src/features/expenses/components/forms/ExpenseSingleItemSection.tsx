"use client";

import { Control, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import AmountInput from "@/components/forms/AmountInput";
import ExpenseSplitTypeInput from "@/features/expenses/components/forms/ExpenseSplitTypeInput";
import ExpenseSplitDetailsInput from "@/features/expenses/components/forms/ExpenseSplitDetailsInput";
import { Member } from "@/types";
import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";

type ExpenseSingleItemSectionProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
  setValue: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["setValue"];
  setError: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["setError"];
  clearErrors: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["clearErrors"];
  groupMembers: Member[];
};

const ExpenseSingleItemSection = ({
  control,
  setValue,
  setError,
  clearErrors,
  groupMembers,
}: ExpenseSingleItemSectionProps) => {
  return (
    <div className="flex-1 space-y-4">
      <AmountInput control={control} name="amount" />
      <ExpenseSplitTypeInput control={control} />

      <ExpenseSplitDetailsInput
        groupMembers={groupMembers}
        control={control}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
      />
    </div>
  );
};

export default ExpenseSingleItemSection;
