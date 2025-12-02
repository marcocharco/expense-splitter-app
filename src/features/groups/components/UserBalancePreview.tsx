"use client";
import { calculateMemberBalances } from "@/features/groups/utils/groupBalanceCalculator";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/hooks/useUser";
import { formatCurrency } from "@/utils/formatCurrency";
import { useBalanceInputs } from "@/features/groups/hooks/useBalanceInputs";
import { useMemo } from "react";

const UserBalancePreview = () => {
  const group = useCurrentGroup();
  const { user } = useUser();
  const { data } = useBalanceInputs(group?.id ?? "");

  const memberBalances = useMemo(() => {
    if (!data?.expenses || !data?.payments) return new Map();
    return calculateMemberBalances({
      expenses: data.expenses,
      payments: data.payments,
    });
  }, [data?.expenses, data?.payments]);

  if (!user || !group) return null;

  const userBalance = memberBalances.get(user.id);
  const netOwing = userBalance?.netOwing ?? 0;
  const absValue = Math.abs(netOwing);

  let displayText;

  // Don't show if balance is zero
  if (absValue === 0) {
    displayText = "$0.00";
  } else {
    const isOwed = netOwing < 0;
    displayText = isOwed
      ? `You are owed ${formatCurrency(absValue)}`
      : `You owe ${formatCurrency(absValue)}`;
  }

  return (
    <div className="grow">
      <h3 className="font-normal text-sm text-neutral-500">Your Balance</h3>
      <p className={`text-lg font-medium`}>{displayText}</p>
    </div>
  );
};

export default UserBalancePreview;
