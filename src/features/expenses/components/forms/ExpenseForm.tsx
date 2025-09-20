"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";

import { useUser } from "@/features/users/context/UserContext";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import AmountInput from "@/components/forms/AmountInput";
import TitleInput from "@/components/forms/TitleInput";
import MemberSelectInput from "@/components/forms/MemberSelectInput";
import DatePickerInput from "@/components/forms/DatePickerInput";
import ExpenseSplitTypeInput from "@/features/expenses/components/forms/ExpenseSplitTypeInput";
import ExpenseSplitDetailsInput from "@/features/expenses/components/forms/ExpenseSplitDetailsInput";
import ExpenseCategoryInput from "@/features/expenses/components/forms/ExpenseCategoryInput";
import { Expense } from "@/types";
import { toFormValues } from "@/features/expenses/utils/expenseMapper";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { DateToYMD } from "@/utils/formatDate";
import { toast } from "sonner";

type ExpenseFormProps = {
  type: "newExpense" | "updateExpense";
  initialExpense?: Expense;
  onSuccess: () => void;
};

const ExpenseForm = ({ type, initialExpense, onSuccess }: ExpenseFormProps) => {
  const { user } = useUser();
  const groupData = useCurrentGroup();
  if (!user) {
    throw new Error("Missing user");
  }
  const groupMembers = groupData.members;
  const { addExpense, editExpense, isAddingExpense, isEditingExpense } =
    useExpenses(groupData.id);

  const formSchema = ExpenseFormSchema();

  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues =
    type === "updateExpense"
      ? toFormValues({
          expense: initialExpense!,
          members: groupMembers,
        })
      : initialExpense
      ? {
          // default to the current date for duplicate expenses
          ...toFormValues({
            expense: initialExpense,
            members: groupMembers,
          }),
          date: DateToYMD(new Date()), // Reset to today's date
        }
      : {
          amount: 0,
          title: "",
          paidBy: user.id ?? "",
          date: DateToYMD(new Date()),
          category: undefined,
          splitType: "even",
          selectedMembers: user ? [user.id] : [],
          memberSplits: groupMembers.map((m) => ({ userId: m.id, weight: 0 })),
        };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isLoading = type === "newExpense" ? isAddingExpense : isEditingExpense;

  const onSubmit = async (values: FormValues) => {
    const { selectedMembers, memberSplits, ...rest } = values;

    const filteredSplits = memberSplits.filter((split) =>
      selectedMembers.includes(split.userId)
    );
    try {
      if (type === "newExpense") {
        await addExpense({ ...rest, memberSplits: filteredSplits });
        toast(`Successfully added "${values.title}"`);
        onSuccess();
      } else if (type === "updateExpense" && initialExpense) {
        await editExpense({
          values: { ...rest, memberSplits: filteredSplits },
          expenseId: initialExpense.id,
        });
        toast(`Successfully updated "${values.title}"`);
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full"
        autoComplete="off"
      >
        {/* left side (general expense info) */}
        <div className="space-y-4">
          <TitleInput
            control={form.control}
            name="title"
            label="Title"
            placeholder="e.g. Grocery bill, Flight tickets, etc."
          />

          <AmountInput control={form.control} name="amount" />

          <MemberSelectInput
            control={form.control}
            name="paidBy"
            formType="expense"
            groupMembers={groupMembers}
            currentUserId={user.id ?? ""}
          />

          <DatePickerInput control={form.control} name="date" />

          <ExpenseCategoryInput control={form.control} groupId={groupData.id} />
        </div>

        {/* right side (split info) */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 space-y-4">
            <ExpenseSplitTypeInput control={form.control} />

            <ExpenseSplitDetailsInput
              groupMembers={groupMembers}
              control={form.control}
              setValue={form.setValue}
              setError={form.setError}
              clearErrors={form.clearErrors}
            />
          </div>

          {/* submit form button */}
          <div className="flex justify-end mt-8">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {type === "newExpense" ? "Add Expense" : "Update Expense"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ExpenseForm;
