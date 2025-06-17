"use client";

import { useState } from "react";
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
import { Expense } from "@/types";
import UpdateExpenseSheet from "../forms/expense/UpdateExpenseSheet";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCurrentGroup } from "@/context/CurrentGroupContext";

const GroupExpenses = () => {
  const group = useCurrentGroup();
  const { expenses } = useExpenses(group?.id ?? "");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleRowClick = (expense: Expense) => setSelectedExpense(expense);

  return (
    <>
      <Table>
        <TableCaption>A list of recent group activity.</TableCaption>
        <TableHeader>
          <TableRow className="h-fit  hover:bg-background">
            <TableHead className="w-[20%]">Title</TableHead>
            <TableHead className="text-right w-[10%] pr-4">Amount</TableHead>
            <TableHead className="w-[15%]">Paid By</TableHead>
            <TableHead className="w-[15%]">Date</TableHead>
            <TableHead className="w-[10%]">Category</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses?.map((expense) => {
            const formattedDate = new Date(expense.date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            );

            return (
              <TableRow
                key={expense.id}
                onClick={() => handleRowClick(expense)}
                className="cursor-pointer h-12"
              >
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell className="text-right pr-4 font-number tabular-nums">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>{expense.paid_by.name}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                  {expense.category
                    ? expense.category.icon + "  " + expense.category.name
                    : "-"}
                </TableCell>
                <TableCell>
                  {expense.settlement
                    ? expense.settlement.status === "open"
                      ? "In Settlement"
                      : "Paid"
                    : "Unpaid"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <UpdateExpenseSheet
        expense={selectedExpense}
        onOpenChange={setSelectedExpense}
      />
    </>
  );
};

export default GroupExpenses;
