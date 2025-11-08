"use client";

import {
  ColumnDef,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useExpenseFilters } from "@/features/expenses/contexts/ExpenseFiltersContext";

interface UseExpenseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function useExpenseTable<TData, TValue>({
  columns,
  data,
}: UseExpenseTableProps<TData, TValue>) {
  const { columnFilters, setColumnFilters } = useExpenseFilters();

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
    state: {
      columnFilters,
      columnVisibility: {
        memberSplits: false, // Hide the memberSplits column
      },
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  return {
    table,
    isFiltered,
  };
}
