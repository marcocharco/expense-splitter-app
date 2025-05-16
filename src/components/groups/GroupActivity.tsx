"use client";

import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useExpenses } from "@/context/ExpensesContext";
import ExpenseDetailsCard from "./ExpenseDetailsCard";
import { Expense } from "@/types";

const GroupActivity = () => {
  const expenses = useExpenses();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  // update dialog modal when new expense is clicked
  useEffect(() => {
    if (!currentExpense) return;
    dialogRef.current?.showModal();
  }, [currentExpense]);

  // remove currentExpense state when dialog is closed
  useEffect(() => {
    const currDialog = dialogRef.current;
    if (!currDialog) return;

    const handleClose = () => setCurrentExpense(null);
    currDialog.addEventListener("close", handleClose);

    return () => currDialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <section>
      <dialog ref={dialogRef} className="expense-details-container">
        <ExpenseDetailsCard expense={currentExpense} />
      </dialog>

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

            const formattedAmount = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            return (
              <TableRow
                key={expense.id}
                onClick={() => setCurrentExpense(expense)}
              >
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell className="text-right pr-4 font-number">
                  {formattedAmount.format(expense.amount)}
                </TableCell>
                <TableCell>{expense.paid_by.name}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                  {expense.category ? expense.category.name : "-"}
                </TableCell>
                <TableCell>{expense.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default GroupActivity;
