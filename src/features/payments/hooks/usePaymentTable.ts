"use client";

import {
  ColumnDef,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePaymentFilters } from "@/features/payments/contexts/PaymentFiltersContext";

interface UsePaymentTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function usePaymentTable<TData, TValue>({
  columns,
  data,
}: UsePaymentTableProps<TData, TValue>) {
  const { columnFilters, setColumnFilters } = usePaymentFilters();

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
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  return {
    table,
    isFiltered,
  };
}
