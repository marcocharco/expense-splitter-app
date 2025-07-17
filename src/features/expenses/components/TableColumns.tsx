"use client";

import { Expense } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";

function getPaymentStatus(expense: Expense) {
  if (expense.settlement) {
    if (expense.settlement.status === "closed") return "Paid";
    return "In Settlement";
  }

  const total = expense.splits.filter(
    (s) => expense.paid_by.id !== s.user.id
  ).length;
  const paid = expense.splits.filter(
    (s) => s.remaining_owing === 0 && s.initial_owing > 0
  ).length;

  if (paid === total) return "Paid";
  return `${paid}/${total} Paid`;
}

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right pr-4">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formattedAmount = formatCurrency(amount);

      return <div className="text-right pr-4">{formattedAmount}</div>;
    },
  },
  {
    accessorKey: "paid_by",
    header: "Paid By",
    cell: ({ row }) => {
      const paidBy = row.original.paid_by;
      return <div>{paidBy.name}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = formatDisplayDate(date);
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return <div>{category ? category.icon + "  " + category.name : "-"}</div>;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const expense = row.original;
      return <div>{getPaymentStatus(expense)}</div>;
    },
  },
];
