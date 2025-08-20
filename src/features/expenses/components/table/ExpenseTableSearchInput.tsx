"use client";

import { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExpenseTableSearchInputProps<TData> {
  table: Table<TData>;
}

export function ExpenseTableSearchInput<TData>({
  table,
}: ExpenseTableSearchInputProps<TData>) {
  const searchValue =
    (table.getColumn("title")?.getFilterValue() as string) ?? "";

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search expenses..."
        value={searchValue}
        onChange={(event) =>
          table.getColumn("title")?.setFilterValue(event.target.value)
        }
        className="min-w-3xs w-3xs pl-8 pr-8"
      />
      {searchValue && (
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
  );
}
