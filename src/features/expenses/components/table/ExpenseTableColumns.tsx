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

function getUserStatus(expense: Expense, currentUserId: string) {
  const userSplit = expense.splits.find(
    (split) => split.user.id === currentUserId
  );

  const isPayer = expense.paid_by.id === currentUserId;

  // not included in any splits and wasn't the one paying
  if (!userSplit && !isPayer) {
    return { type: "not_involved", amount: 0, text: "Not involved" };
  }

  if (isPayer) {
    // User paid the expense
    const totalOwedToUser = expense.splits
      .filter((split) => split.user.id !== currentUserId)
      .reduce((sum, split) => sum + split.remaining_owing, 0);

    if (totalOwedToUser > 0) {
      return {
        type: "owed",
        amount: totalOwedToUser,
        text: `You're owed ${formatCurrency(totalOwedToUser)}`,
      };
    } else {
      // Calculate the total amount that was initially owed to the user
      const totalInitiallyOwedToUser = expense.splits
        .filter((split) => split.user.id !== currentUserId)
        .reduce((sum, split) => sum + split.initial_owing, 0);

      return {
        type: "paid",
        amount: totalInitiallyOwedToUser,
        text: `You were paid ${formatCurrency(totalInitiallyOwedToUser)}`,
      };
    }
  } else {
    // User didn't pay the expense
    if (userSplit && userSplit.remaining_owing > 0) {
      return {
        type: "owes",
        amount: userSplit.remaining_owing,
        text: `You owe ${formatCurrency(userSplit.remaining_owing)}`,
      };
    } else if (userSplit && userSplit.initial_owing > 0) {
      return {
        type: "paid_share",
        amount: userSplit.initial_owing,
        text: `You paid ${formatCurrency(userSplit.initial_owing)}`,
      };
    } else {
      return {
        type: "no_cost",
        amount: 0,
        text: "No cost to you",
      };
    }
  }
}

export const createExpenseTableColumns = (
  onEditExpense: (expense: Expense) => void,
  onDeleteExpense: (expenseId: string) => void,
  onDuplicateExpense: (expense: Expense) => void,
  onViewExpense: (expense: Expense) => void,
  currentUserId?: string
): ColumnDef<Expense>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const expense = row.original;
      const isMultiItem = expense.items && expense.items.length > 0;

      return (
        <div className="flex items-center gap-2">
          <span>{expense.title}</span>
          {isMultiItem && (
            <>
              <span>·</span>
              <span className="text-muted-foreground">
                {expense.items?.length} items
              </span>
            </>
          )}
        </div>
      );
    },
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
    accessorKey: "yourStatus",
    header: () => <div className="pr-4">Your Status</div>,
    cell: ({ row }) => {
      if (!currentUserId) return;

      const expense = row.original;
      const status = getUserStatus(expense, currentUserId);

      const getStatusTextColor = (type: string) => {
        switch (type) {
          case "owed":
            return "text-green-600"; // Current user is owed money
          case "owes":
            return "text-red-600"; // Current user owes money
          case "paid":
            return "text-gray-400"; // Current user was paid
          case "paid_share":
            return "text-gray-400"; // Current user paid their share
          case "not_involved":
            return "text-gray-400";
          case "no_cost":
            return "text-gray-600";
          default:
            return "";
        }
      };

      return (
        <div className={`pr-4 ${getStatusTextColor(status.type)}`}>
          <span className="text-sm">{status.text}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "paidBy",
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
      return value.includes(category?.id || "");
    },
  },
  {
    accessorKey: "status",
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
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const expense = row.original;

      const unpaid =
        expense.splits.filter(
          (s) => s.remaining_owing === 0 && s.initial_owing > 0
        ).length > 0;

      // disabled if in settlement or is paid (>1 users have paid)
      const disableEdit = expense?.settlement?.id ? true : unpaid;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewExpense(expense)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicateExpense(expense)}>
              Duplicate
            </DropdownMenuItem>
            {!disableEdit && (
              <>
                <DropdownMenuItem onClick={() => onEditExpense(expense)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDeleteExpense(expense.id)}
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "memberSplits",
    accessorFn: (expense) => expense.splits.map((split) => split.user.id),
    filterFn: "arrIncludesAll",
  },
];

// For backward compatibility
export const columns = createExpenseTableColumns(
  () => {},
  () => {},
  () => {},
  () => {}
);
