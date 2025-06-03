"use client";
import { calculateMemberBalances } from "@/utils/groupBalanceCalculator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExpenses } from "@/hooks/useExpenses";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import { formatCurrency } from "@/utils/formatCurrency";

const GroupBalances = () => {
  const group = useCurrentGroup();
  const { expenses } = useExpenses(group?.id ?? "");
  const memberBalances = calculateMemberBalances({ expenses });
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
              <TableCell className="text-right tabular-nums">
                {formatCurrency(userBalance?.totalOwing ?? 0)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(userBalance?.totalOwed ?? 0)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
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
