"use client";

import { ColumnDef } from "@tanstack/react-table";
import { usePaymentTable } from "@/features/payments/hooks/usePaymentTable";
import { PaymentTableView } from "./PaymentTableView";
import { PaymentTablePagination } from "./PaymentTablePagination";
import { PaymentTableFilters } from "./PaymentTableFilters";

interface PaymentTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (data: TData) => void;
}

export function PaymentTable<TData, TValue>({
  columns,
  data,
  onRowClick,
}: PaymentTableProps<TData, TValue>) {
  const { table, isFiltered } = usePaymentTable({ columns, data });

  return (
    <>
      <PaymentTableFilters table={table} isFiltered={isFiltered} />
      <PaymentTableView
        table={table}
        columns={columns}
        onRowClick={onRowClick}
      />
      <PaymentTablePagination table={table} />
    </>
  );
}
