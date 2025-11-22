"use client";
import { calculateMemberBalances } from "@/features/groups/utils/groupBalanceCalculator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { useBalanceInputs } from "@/features/groups/hooks/useBalanceInputs";
import { useMemo } from "react";

const GroupBalances = () => {
  const group = useCurrentGroup();
  const { data } = useBalanceInputs(group?.id ?? "");
  const memberBalances = useMemo(() => {
    if (!data?.expenses || !data?.payments) return new Map();
    return calculateMemberBalances({
      expenses: data.expenses,
      payments: data.payments,
    });
  }, [data?.expenses, data?.payments]);
  return (
    <Table>
      <TableCaption>Total owed and owing for each group member.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Total Owes</TableHead>
          <TableHead className="text-right">Total Owed</TableHead>
          <TableHead className="text-right">Net Owing</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {group?.members.map((member) => {
          const userBalance = memberBalances.get(member.id);
          const absValue = Math.abs(userBalance?.netOwing ?? 0);

          return (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(userBalance?.totalOwing ?? 0)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(userBalance?.totalOwed ?? 0)}
              </TableCell>
              <TableCell className="text-right">
                {(userBalance?.netOwing ?? 0) < 0
                  ? `is owed ${formatCurrency(absValue)}`
                  : `owes ${formatCurrency(absValue)}`}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GroupBalances;
