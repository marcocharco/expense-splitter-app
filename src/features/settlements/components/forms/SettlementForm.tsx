"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { formatCurrency } from "@/utils/formatCurrency";
import { startNewSettlement } from "@/features/settlements/server/settlement.actions";
import { useCurrentGroup } from "@/features/groups/context/CurrentGroupContext";
import { useUser } from "@/features/users/context/UserContext";
import { calculateNetBalances } from "@/features/groups/utils/groupBalanceCalculator";
import { useQueryClient } from "@tanstack/react-query";

const SettlementForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUser();
  const group = useCurrentGroup();
  if (!user || !group) {
    throw new Error("Missing user or group");
  }

  const { expenses } = useExpenses(group.id);
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Set<string>>(new Set());

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

  const title = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startSettlement = async () => {
    if (selectedExpenses.length === 0) return;

    const selectedExpenseIds = selectedExpenses.map((expense) => expense.id);

    const balances = calculateNetBalances({
      expenses: selectedExpenses,
    });

    await startNewSettlement({
      groupId: group.id,
      currentUser: user.id,
      title,
      selectedExpenseIds,
      balances,
    });
    queryClient.invalidateQueries({ queryKey: ["groupExpenses", group.id] });
    onSuccess();
  };

  return (
    <>
      {unpaid.map((expense) => (
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
      ))}

      <Button
        variant="outline"
        disabled={selected.size === 0}
        onClick={startSettlement}
      >
        Start Settlement
      </Button>
    </>
  );
};

export default SettlementForm;
