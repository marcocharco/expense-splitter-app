"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/context/UserContext";
import { calculateSettlementBalances } from "@/features/settlements/utils/settlementBalanceCalculator";
import TitleInput from "@/components/forms/TitleInput";
import { SettlementFormSchema } from "@/features/settlements/schemas/settlementFormSchema";
import MultiSelectInput from "@/components/forms/MultiSelectInput";
import { useSettlements } from "../../hooks/useSettlements";

const SettlementForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUser();
  const group = useCurrentGroup();
  if (!user) {
    throw new Error("Missing user");
  }

  const { expenses } = useExpenses(group.id);

  const { startSettlement, isStartingSettlement } = useSettlements(group.id);

  const formSchema = SettlementFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues = {
    title: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    selectedExpenseIds: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const unpaidExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        !expense.settlement &&
        expense.splits.some((split) => split.remaining_owing > 0)
    );
  }, [expenses]);

  // Transform expenses into items format for MultiSelectInput
  const expenseItems = useMemo(() => {
    return unpaidExpenses.map((expense) => ({
      id: expense.id,
      label: `${expense.title} - ${formatCurrency(expense.amount)}`,
    }));
  }, [unpaidExpenses]);

  // Calculate selected expenses based on form values
  const selectedExpenseIds = form.watch("selectedExpenseIds");
  const selectedExpenses = useMemo(() => {
    return unpaidExpenses.filter((expense) =>
      selectedExpenseIds.includes(expense.id)
    );
  }, [unpaidExpenses, selectedExpenseIds]);

  const onSubmit = async (values: FormValues) => {
    if (selectedExpenses.length === 0) return;

    const balances = calculateSettlementBalances({
      expenses: selectedExpenses,
    });

    try {
      await startSettlement({
        currentUser: user.id,
        title: values.title,
        selectedExpenseIds: values.selectedExpenseIds,
        balances,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        autoComplete="off"
      >
        <TitleInput
          control={form.control}
          name="title"
          label="Settlement Title"
          placeholder="e.g. Weekend Trip Settlement, Monthly Bills, etc."
        />

        <div className="space-y-4">
          <h3 className="form-label">Select Expenses to Settle</h3>

          {expenseItems.length > 0 ? (
            <MultiSelectInput<FormValues>
              control={form.control}
              name="selectedExpenseIds"
              items={expenseItems}
            />
          ) : (
            <span>No expenses to settle</span>
          )}
        </div>

        <Button
          type="submit"
          disabled={selectedExpenses.length === 0 || isStartingSettlement}
          className="form-btn"
        >
          {isStartingSettlement ? "Creating Settlement..." : "Start Settlement"}
        </Button>
      </form>
    </Form>
  );
};

export default SettlementForm;
