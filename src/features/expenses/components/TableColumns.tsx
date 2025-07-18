"use client";

import { Expense } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export const createColumns = (
  onEditExpense: (expense: Expense) => void
): ColumnDef<Expense>[] => [
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
    filterFn: (row, id, value) => {
      const member = row.original.paid_by;
      return value.includes(member?.id || "");
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
    filterFn: (row, id, value) => {
      if (!value) return true;

      const { type, date, startDate, endDate } = value;
      const rowDate = new Date(row.getValue("date") as string);

      switch (type) {
        case "before":
          return date ? rowDate < date : true;
        case "after":
          return date ? rowDate > date : true;
        case "between":
          return startDate && endDate
            ? rowDate >= startDate && rowDate <= endDate
            : true;
        default:
          return true;
      }
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return <div>{category ? category.icon + "  " + category.name : "-"}</div>;
    },
    filterFn: (row, id, value) => {
      const category = row.original.category;
      return value.includes(category?.id?.toString() || "");
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const expense = row.original;
      return <div>{getPaymentStatus(expense)}</div>;
    },
    filterFn: (row, id, value) => {
      const status = getPaymentStatus(row.original);

      let statusCategory;
      if (status === "Paid") {
        statusCategory = "paid";
      } else if (status === "In Settlement") {
        statusCategory = "in settlement";
      } else {
        statusCategory = "unpaid";
      }

      return value.includes(statusCategory);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditExpense(expense)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// For backward compatibility
export const columns = createColumns(() => {});
