"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { createContext, useContext, useState, ReactNode } from "react";

interface PaymentFiltersContextType {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

const PaymentFiltersContext = createContext<PaymentFiltersContextType | null>(
  null
);

export const usePaymentFilters = () => {
  const context = useContext(PaymentFiltersContext);
  if (!context) {
    throw new Error(
      "usePaymentFilters must be used within PaymentFiltersProvider"
    );
  }
  return context;
};

export const PaymentFiltersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return (
    <PaymentFiltersContext.Provider value={{ columnFilters, setColumnFilters }}>
      {children}
    </PaymentFiltersContext.Provider>
  );
};
