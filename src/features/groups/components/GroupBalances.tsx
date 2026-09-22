"use client";
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
import { useGroupMemberBalances } from "@/features/groups/hooks/useGroupMemberBalances";

const GroupBalances = () => {
  const group = useCurrentGroup();
  const memberBalances = useGroupMemberBalances(group?.id ?? "");
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
              <TableCell
                className={`text-right font-medium ${
                  (userBalance?.netOwing ?? 0) < 0
                    ? "text-main"
                    : (userBalance?.netOwing ?? 0) > 0
                    ? "text-orange-500"
                    : ""
                }`}
              >
                {(userBalance?.netOwing ?? 0) < 0
                  ? `is owed ${formatCurrency(absValue)}`
                  : (userBalance?.netOwing ?? 0) > 0
                  ? `owes ${formatCurrency(absValue)}`
                  : "Settled up"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GroupBalances;
