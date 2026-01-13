"use client";

import { Payment } from "@/features/payments/types/payment";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const createPaymentTableColumns = (
  onViewPayment: (payment: Payment) => void
): ColumnDef<Payment>[] => [
  {
    accessorKey: "paid_by",
    header: "Paid By",
    cell: ({ row }) => {
      const paidBy = row.original.paid_by;
      return <div>{paidBy.name}</div>;
    },
  },
  {
    accessorKey: "paid_to",
    header: "Paid To",
    cell: ({ row }) => {
      const paidTo = row.original.paid_to;
      return <div>{paidTo.name}</div>;
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
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = formatDisplayDate(date);
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const payment = row.original;
      const isSettlement = !!payment.settlement;
      const expenseCount = payment.expense_allocations?.length || 0;
      
      return (
        <div className="flex items-center gap-2">
          <Badge variant={isSettlement ? "default" : "secondary"}>
            {isSettlement ? "Settlement" : "Expense"}
          </Badge>
          {!isSettlement && expenseCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewPayment(payment)}>
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
