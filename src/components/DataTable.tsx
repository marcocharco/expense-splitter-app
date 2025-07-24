"use client";

import {
  ColumnDef,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableDateFilter } from "./DataTableDateFilter";
import { useQuery } from "@tanstack/react-query";
import { getExpenseCategories } from "@/features/expenses/queries/getExpenseCategories";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useExpenseFilters } from "@/features/expenses/contexts/ExpenseFiltersContext";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { columnFilters, setColumnFilters } = useExpenseFilters();

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="min-w-3xs w-3xs pl-8 pr-8"
          />
          {(table.getColumn("title")?.getFilterValue() as string) && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-1/2 h-full -translate-y-1/2 px-2 hover:bg-transparent"
              onClick={() => table.getColumn("title")?.setFilterValue("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          {table.getColumn("paidBy") && (
            <DataTableFacetedFilter
              column={table.getColumn("paidBy")}
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
          {table.getColumn("date") && (
            <DataTableDateFilter
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
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.id === "title" ? "w-3xs" : undefined}
                  >
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
                      cell.column.id === "actions"
                        ? "w-[40px] px-2"
                        : cell.column.id === "title"
                        ? "w-3xs"
                        : undefined
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
    </>
  );
}
