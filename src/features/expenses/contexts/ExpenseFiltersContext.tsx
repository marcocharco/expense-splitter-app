"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { createContext, useContext, useState, ReactNode } from "react";

interface ExpenseFiltersContextType {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

const ExpenseFiltersContext = createContext<ExpenseFiltersContextType | null>(
  null
);

export const useExpenseFilters = () => {
  const context = useContext(ExpenseFiltersContext);
  if (!context) {
    throw new Error(
      "useExpenseFilters must be used within ExpenseFiltersProvider"
    );
  }
  return context;
};

export const ExpenseFiltersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return (
    <ExpenseFiltersContext.Provider value={{ columnFilters, setColumnFilters }}>
      {children}
    </ExpenseFiltersContext.Provider>
  );
};
