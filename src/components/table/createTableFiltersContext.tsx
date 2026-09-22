"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { createContext, useContext, useState, ReactNode } from "react";

export function createTableFiltersContext(displayName: string) {
  const Context = createContext<{
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  } | null>(null);

  const useFilters = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(`use${displayName}Filters must be used within ${displayName}FiltersProvider`);
    return ctx;
  };

  const Provider = ({ children }: { children: ReactNode }) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    return <Context.Provider value={{ columnFilters, setColumnFilters }}>{children}</Context.Provider>;
  };

  return { useFilters, Provider };
}
