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
import { useExpenses } from "@/context/ExpensesContext";
import { useCurrentGroup } from "@/context/CurrentGroupContext";

const GroupBalances = () => {
  const { expenses } = useExpenses();
  const memberBalances = calculateMemberBalances({ expenses });
  const group = useCurrentGroup();
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
          const currencyFormatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          });

          const userBalance = memberBalances.get(member.id);
          const absValue = Math.abs(userBalance?.netOwing ?? 0);

          return (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell className="text-right">
                {currencyFormatter.format(userBalance?.totalOwing ?? 0)}
              </TableCell>
              <TableCell className="text-right">
                {currencyFormatter.format(userBalance?.totalOwed ?? 0)}
              </TableCell>
              <TableCell className="text-right">
                {/* {(userBalance?.netOwing ?? 0) < 0
                  ? `( ${currencyFormatter.format(absValue)} )`
                  : `${absValue}`} */}
                {(userBalance?.netOwing ?? 0) < 0
                  ? `is owed ${currencyFormatter.format(absValue)}`
                  : `owes ${currencyFormatter.format(absValue)}`}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GroupBalances;
