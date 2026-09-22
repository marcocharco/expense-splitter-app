"use client";

import { createTableFiltersContext } from "@/components/table/createTableFiltersContext";

const { useFilters: useExpenseFilters, Provider: ExpenseFiltersProvider } =
  createTableFiltersContext("Expense");

export { useExpenseFilters, ExpenseFiltersProvider };
