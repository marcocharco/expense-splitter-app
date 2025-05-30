"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Control, useController } from "react-hook-form";

import { ExpenseFormSchema } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ExpenseAmountInputProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
};

const currencyFormatter = (amount: number) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const ExpenseAmountInput = ({ control }: ExpenseAmountInputProps) => {
  const { field } = useController({ name: "amount", control });

  const [displayValue, setDisplayValue] = useState(
    field.value == 0 ? "" : currencyFormatter(field.value)
  );

  useEffect(() => {
    if (!field.value) {
      setDisplayValue("");
    }
    if (field.value === 0) {
      setDisplayValue("");
    }
  }, [field.value]);
  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">Amount</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder="$0.00"
                className="input-class input-no-spinner"
                type="text"
                inputMode="decimal"
                id="amount"
                {...field}
                value={displayValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  // Only allow up to 2 decimal places
                  if (value.includes(".")) {
                    const [, decimal] = value.split(".");
                    if (decimal && decimal.length > 2) {
                      return;
                    }
                  }
                  setDisplayValue(value);

                  const parsed = parseFloat(value);
                  field.onChange(isNaN(parsed) ? 0 : parsed);
                }}
                onBlur={() => {
                  const parsed = parseFloat(displayValue);
                  const clean = isNaN(parsed) ? 0 : parsed;

                  field.onChange(clean); // update form value
                  setDisplayValue(
                    clean > 0 ? currencyFormatter(clean) : "" // update display
                  );
                }}
                onFocus={() => {
                  setDisplayValue(
                    field.value === 0 ? "" : field.value?.toString()
                  );
                }}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
            <FormMessage className="form-message" />
          </div>
        </div>
      )}
    />
  );
};

export default ExpenseAmountInput;
