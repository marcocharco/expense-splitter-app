"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PaymentTableFiltersProps<TData> {
  table: Table<TData>;
  isFiltered: boolean;
}

export function PaymentTableFilters<TData>({
  table,
  isFiltered,
}: PaymentTableFiltersProps<TData>) {
  return (
    <div className="flex items-end py-4 gap-2 h-[72px]">
      {/* Placeholder for future filters to match ExpenseTable layout */}
      <div className="flex-1" />
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
