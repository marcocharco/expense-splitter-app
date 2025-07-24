"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { formatCurrency } from "@/utils/formatCurrency";
import { startNewSettlement } from "@/features/settlements/server/settlement.actions";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/context/UserContext";
import { calculateSettlementBalances } from "@/features/settlements/utils/settlementBalanceCalculator";
import { useQueryClient } from "@tanstack/react-query";
import TitleInput from "@/components/forms/TitleInput";
import { SettlementFormSchema } from "@/features/settlements/schemas/settlementFormSchema";

const SettlementForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUser();
  const group = useCurrentGroup();
  if (!user || !group) {
    throw new Error("Missing user or group");
  }

  const { expenses } = useExpenses(group.id);
  const queryClient = useQueryClient();

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

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const toggle = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const unpaid = useMemo(() => {
    return expenses.filter(
      (expense) =>
        !expense.settlement &&
        expense.splits.some((split) => split.remaining_owing > 0)
    );
  }, [expenses]);

  const selectedExpenses = useMemo(
    () => unpaid.filter((e) => selected.has(e.id)),
    [unpaid, selected]
  );

  const startSettlement = async (values: FormValues) => {
    if (selectedExpenses.length === 0) return;

    setIsLoading(true);
    try {
      const selectedExpenseIds = selectedExpenses.map((expense) => expense.id);

      const balances = calculateSettlementBalances({
        expenses: selectedExpenses,
      });

      await startNewSettlement({
        groupId: group.id,
        currentUser: user.id,
        title: values.title,
        selectedExpenseIds,
        balances,
      });
      queryClient.invalidateQueries({ queryKey: ["groupExpenses", group.id] });
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(startSettlement)}
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
          {unpaid.length === 0 ? (
            <p className="text-muted-foreground">
              No unpaid expenses to settle.
            </p>
          ) : (
            unpaid.map((expense) => (
              <div key={expense.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selected.has(expense.id)}
                  onCheckedChange={(v) => toggle(expense.id, v === true)}
                />
                <span>{expense.title}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        <Button
          type="submit"
          disabled={selected.size === 0 || isLoading}
          className="form-btn"
        >
          {isLoading ? "Creating Settlement..." : "Start Settlement"}
        </Button>
      </form>
    </Form>
  );
};

export default SettlementForm;
