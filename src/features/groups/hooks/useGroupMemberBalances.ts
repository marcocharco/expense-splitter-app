"use client";

import { useMemo } from "react";
import { useBalanceInputs } from "@/features/groups/hooks/useBalanceInputs";
import { calculateMemberBalances } from "@/features/groups/utils/groupBalanceCalculator";

export function useGroupMemberBalances(groupId: string) {
  const { data } = useBalanceInputs(groupId);

  const memberBalances = useMemo(() => {
    if (!data?.expenses || !data?.payments) return new Map();
    return calculateMemberBalances({
      expenses: data.expenses,
      payments: data.payments,
    });
  }, [data?.expenses, data?.payments]);

  return memberBalances;
}
