"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseTableFacetedFilter } from "@/features/expenses/components/table/ExpenseTableFacetedFilter";
import { ExpenseTableDateFilter } from "@/features/expenses/components/table/ExpenseTableDateFilter";
import { ExpenseTableSearchInput } from "@/features/expenses/components/table/ExpenseTableSearchInput";
import { useExpenseTableFilters } from "@/features/expenses/hooks/useExpenseTableFilters";

interface ExpenseTableFiltersProps<TData> {
  table: Table<TData>;
  isFiltered: boolean;
}

export function ExpenseTableFilters<TData>({
  table,
  isFiltered,
}: ExpenseTableFiltersProps<TData>) {
  const { members, categories, statuses } = useExpenseTableFilters();

  return (
    <div className="flex items-end py-4 gap-2">
      <ExpenseTableSearchInput table={table} />

      <div className="flex overflow-x-auto gap-2 no-scrollbar">
        {table.getColumn("paidBy") && (
          <ExpenseTableFacetedFilter
            column={table.getColumn("paidBy")}
            title="Paid By"
            options={members}
          />
        )}
        {table.getColumn("memberSplits") && (
          <ExpenseTableFacetedFilter
            column={table.getColumn("memberSplits")}
            title="Includes"
            options={members}
          />
        )}
        {table.getColumn("category") && (
          <ExpenseTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}
        {table.getColumn("status") && (
          <ExpenseTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("date") && (
          <ExpenseTableDateFilter
            column={table.getColumn("date")}
            title="Date"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
