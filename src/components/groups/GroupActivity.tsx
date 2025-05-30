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
import { useExpenses } from "@/context/ExpensesContext";
import { Expense } from "@/types";
import UpdateExpenseSheet from "../forms/newExpense/UpdateExpenseSheet";

const GroupActivity = () => {
  const { expenses } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleRowClick = (expense: Expense) => setSelectedExpense(expense);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <Table>
        <TableCaption>A list of recent group activity.</TableCaption>
        <TableHeader>
          <TableRow>
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
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell className="text-right pr-4 font-number">
                  {currencyFormatter.format(expense.amount)}
                </TableCell>
                <TableCell>{expense.paid_by.name}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                  {expense.category
                    ? expense.category.icon + "  " + expense.category.name
                    : "-"}
                </TableCell>
                <TableCell>{expense.status}</TableCell>
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

export default GroupActivity;
