"use client";

import { createContext, useContext, useState } from "react";
// import { getGroupExpenses } from "@/lib/queries/getGroupExpenses";
import { Expense } from "@/types";
// import { useCurrentGroup } from "@/context/CurrentGroupContext";

type ExpensesContextType = {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined
);

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
};

export const ExpensesProvider = ({
  initialExpenses,
  children,
}: {
  initialExpenses: Expense[];
  children: React.ReactNode;
}) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  return (
    <ExpensesContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};
