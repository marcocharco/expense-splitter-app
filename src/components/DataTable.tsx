"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { useQuery } from "@tanstack/react-query";
import { getExpenseCategories } from "@/features/expenses/queries/getExpenseCategories";
import { useCurrentGroup } from "@/features/groups/context/CurrentGroupContext";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  const groupData = useCurrentGroup();
  const groupMembers = groupData?.members ?? [];

  const members =
    groupMembers.map((member) => ({
      value: member.id,
      label: member.name,
    })) ?? [];

  const statuses = [
    {
      value: "paid",
      label: "Paid",
    },
    {
      value: "unpaid",
      label: "Unpaid",
    },
    {
      value: "in settlement",
      label: "In Settlement",
    },
  ];

  const { data: categoriesDB } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getExpenseCategories(),
  });

  const categories =
    categoriesDB?.map((category) => ({
      value: category.id.toString(),
      label: `${category.icon} ${category.name}`,
    })) ?? [];

  return (
    <>
      <div className="flex items-end py-4 gap-2">
        <Input
          placeholder="Search expenses..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {table.getColumn("paid_by") && (
          <DataTableFacetedFilter
            column={table.getColumn("paid_by")}
            title="Paid By"
            options={members}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
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
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.id === "actions" ? "w-[40px] px-2" : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-12 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
