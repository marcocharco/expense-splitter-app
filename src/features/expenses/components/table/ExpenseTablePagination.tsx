"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseTablePaginationProps<TData> {
  table: Table<TData>;
}

export function ExpenseTablePagination<TData>({
  table,
}: ExpenseTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
