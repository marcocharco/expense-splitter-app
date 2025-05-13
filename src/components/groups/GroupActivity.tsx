import React from "react";
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

const GroupActivity = () => {
  const expenses = useExpenses();

  return (
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
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.title}</TableCell>
              <TableCell className="text-right pr-4">
                {formattedAmount.format(expense.amount)}
              </TableCell>
              <TableCell>{expense.paid_by.name}</TableCell>
              <TableCell>{formattedDate}</TableCell>
              <TableCell>{expense.category_id.name}</TableCell>
              <TableCell>{expense.status}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GroupActivity;
