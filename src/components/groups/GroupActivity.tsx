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
    <div className="lg:mt-4">
      <Table>
        <TableCaption>A list of recent group activity.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Paid By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
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
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell>${expense.amount}</TableCell>
                <TableCell>{expense.paid_by}</TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>{expense.category_id}</TableCell>
                <TableCell>{expense.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default GroupActivity;
