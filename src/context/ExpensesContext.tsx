"use client";

import { createContext, useContext, useState } from "react";
import { Expense } from "@/types";

type ExpensesContextType = {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
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

  const addExpense = (newExpense: Expense) => {
    setExpenses((prev) =>
      [...prev, newExpense].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
};
