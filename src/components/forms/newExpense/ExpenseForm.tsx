"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormSchema } from "@/lib/utils";

import { useUser } from "@/context/UserContext";
import { useCurrentGroup } from "@/context/CurrentGroupContext";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import ExpenseAmountInput from "./ExpenseAmountInput";
import ExpenseTitleInput from "./ExpenseTitleInput";
import ExpensePaidByInput from "./ExpensePaidByInput";
import ExpenseDateInput from "./ExpenseDateInput";
import ExpenseSplitTypeInput from "./ExpenseSplitTypeInput";
import ExpenseSplitDetailsInput from "./ExpenseSplitDetailsInput";
import ExpenseCategoryInput from "./ExpenseCateogryInput";
import { Expense } from "@/types";
import { toFormValues } from "@/utils/expenseMapper";
import { useExpenses } from "@/hooks/useExpenses";

type ExpenseFormProps = {
  type: "newExpense" | "updateExpense";
  initialExpense?: Expense;
  onSuccess?: () => void;
};

const ExpenseForm = ({ type, initialExpense, onSuccess }: ExpenseFormProps) => {
  const { user } = useUser();
  const groupData = useCurrentGroup();
  const groupMembers = groupData?.members ?? [];
  const { addExpense } = useExpenses(groupData?.id ?? "");

  const formSchema = ExpenseFormSchema();

  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues =
    type === "updateExpense"
      ? toFormValues({
          expense: initialExpense!,
          members: groupMembers,
        })
      : {
          amount: 0,
          title: "",
          paidBy: user?.id ?? "",
          date: new Date().toISOString(),
          category: undefined,
          splitType: "even",
          selectedMembers: user ? [user.id] : [],
          memberSplits: groupMembers.map((m) => ({ userId: m.id, weight: 0 })),
        };

  const disabled =
    initialExpense && initialExpense?.settlement_id ? true : false;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    disabled,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    const { selectedMembers, memberSplits, ...rest } = values;

    const filteredSplits = memberSplits.filter((split) =>
      selectedMembers.includes(split.userId)
    );
    setIsLoading(true);
    try {
      await addExpense({ ...rest, memberSplits: filteredSplits });
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        autoComplete="off"
      >
        <ExpenseTitleInput control={form.control} />

        <ExpenseAmountInput control={form.control} />

        <ExpensePaidByInput
          groupMembers={groupMembers}
          currentUserId={user?.id ?? ""}
          control={form.control}
        />

        <ExpenseDateInput control={form.control} />

        <ExpenseCategoryInput control={form.control} />

        <ExpenseSplitTypeInput control={form.control} />

        <ExpenseSplitDetailsInput
          groupMembers={groupMembers}
          control={form.control}
          setValue={form.setValue}
          setError={form.setError}
          clearErrors={form.clearErrors}
        />

        <Button type="submit" className="form-btn" disabled={isLoading}>
          {type === "newExpense" ? "Add Expense" : "Update Expense"}
        </Button>
      </form>
    </Form>
  );
};

export default ExpenseForm;
