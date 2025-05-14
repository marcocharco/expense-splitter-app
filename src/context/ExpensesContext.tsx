"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getGroupExpenses } from "@/lib/queries/getGroupExpenses";
import { Expense } from "@/types";
import { useCurrentGroup } from "@/context/CurrentGroupContext";

const ExpensesContext = createContext<Expense[] | null>(null);

export const useExpenses = () => useContext(ExpensesContext);

export const ExpensesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const group = useCurrentGroup();
  const [expenses, setExpenses] = useState<Expense[] | null>(null);

  useEffect(() => {
    if (group?.id) {
      getGroupExpenses(group.id).then(setExpenses);
    }
  }, [group?.id]);

  return (
    <ExpensesContext.Provider value={expenses}>
      {children}
    </ExpensesContext.Provider>
  );
};
