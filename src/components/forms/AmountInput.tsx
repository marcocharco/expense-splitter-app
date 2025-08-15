"use client";

import { useState, useEffect } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatCurrency } from "@/utils/formatCurrency";

import { Parser } from "expr-eval";

type AmountInputProps<T extends FieldValues, N extends Path<T>> = {
  control: Control<T>;
  name: N;
};

const AmountInput = <T extends FieldValues, N extends Path<T>>({
  control,
  name,
}: AmountInputProps<T, N>) => {
  const { field } = useController({ name: name, control });

  const parser = new Parser({
    operators: {
      add: true,
      concatenate: false,
      conditional: false,
      divide: true,
      factorial: false,
      multiply: true,
      power: false,
      remainder: false,
      subtract: true,

      // Disable and, or, not, <, ==, !=, etc.
      logical: false,
      comparison: false,

      // Disable 'in' and = operators
      in: false,
      assignment: false,
    },
  });

  const [displayValue, setDisplayValue] = useState(
    field.value == 0 ? "" : formatCurrency(field.value)
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
      name={name}
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
                  const value = e.target.value.replace(/[^0-9. +*/()\-]/g, "");

                  // Only allow up to 2 decimal places, and only one decimal point per expression term
                  if (value.includes(".")) {
                    const terms = value.split(/[ +*/\-]/g);
                    let badInputFlag = false;

                    for (const term of terms) {
                      // no more than one decimal per term in expression
                      if (term.replace(/[^.]/g, "").length > 1) {
                        badInputFlag = true;
                        break;
                      } else {
                        // no more than two decimal places per term
                        const [, decimal] = term.split(".");
                        if (decimal && decimal.length > 2) {
                          badInputFlag = true;
                          break;
                        }
                      }
                    }
                    if (badInputFlag) return;
                  }
                  // Check if the value exceeds the maximum limit
                  const parsed = parseFloat(value);
                  if (parsed >= 1000000000) {
                    return;
                  }
                  setDisplayValue(value);

                  field.onChange(isNaN(parsed) ? 0 : parsed);
                }}
                onBlur={() => {
                  let completedValue = 0;

                  try {
                    const rawResult = parser.evaluate(displayValue);
                    // Round to 2 decimal places to fix floating-point precision issues
                    completedValue = Math.round(rawResult * 100) / 100;
                  } catch {
                    completedValue = parseFloat(displayValue) || 0;
                  }

                  field.onChange(completedValue); // update form value
                  setDisplayValue(
                    completedValue > 0 ? formatCurrency(completedValue) : "" // update display value with currency format
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

export default AmountInput;
