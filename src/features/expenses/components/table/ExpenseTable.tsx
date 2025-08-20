"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useExpenseTable } from "@/features/expenses/hooks/useExpenseTable";
import { ExpenseTableFilters } from "@/features/expenses/components/table/ExpenseTableFilters";
import { ExpenseTableView } from "@/features/expenses/components/table/ExpenseTableView";
import { ExpenseTablePagination } from "@/features/expenses/components/table/ExpenseTablePagination";

interface ExpenseTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ExpenseTable<TData, TValue>({
  columns,
  data,
}: ExpenseTableProps<TData, TValue>) {
  const { table, isFiltered } = useExpenseTable({ columns, data });

  return (
    <>
      <ExpenseTableFilters table={table} isFiltered={isFiltered} />
      <ExpenseTableView table={table} columns={columns} />
      <ExpenseTablePagination table={table} />
    </>
  );
}
