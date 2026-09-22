"use client";

import { createTableFiltersContext } from "@/components/table/createTableFiltersContext";

const { useFilters: usePaymentFilters, Provider: PaymentFiltersProvider } =
  createTableFiltersContext("Payment");

export { usePaymentFilters, PaymentFiltersProvider };
