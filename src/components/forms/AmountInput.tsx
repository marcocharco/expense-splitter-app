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
import { validateNumericInput } from "@/utils/validateNumericInput";

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
                  const { value, isValid } = validateNumericInput(
                    e.target.value
                  );

                  if (!isValid) {
                    return;
                  }

                  // Check if the value exceeds the maximum limit
                  const numValue = parseFloat(value) || 0;
                  if (numValue >= 1000000000) {
                    return;
                  }

                  setDisplayValue(value);

                  // allow input of negative numbers, but do not update split calculations
                  // this allows users to input something like -10 + 20 and still get an expected result
                  if (numValue < 0) {
                    return;
                  }

                  field.onChange(numValue);
                }}
                onBlur={() => {
                  let completedValue = 0;

                  try {
                    const evaluatedResult = parser.evaluate(displayValue);
                    // Round to 2 decimal places to fix floating-point precision issues
                    completedValue = Math.round(evaluatedResult * 100) / 100;
                  } catch {
                    completedValue = parseFloat(displayValue) || 0;
                  }

                  // check for negative values
                  if (completedValue < 0) {
                    completedValue = 0;
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
