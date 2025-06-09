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

type AmountInputProps<T extends FieldValues, N extends Path<T>> = {
  control: Control<T>;
  name: N;
};

const AmountInput = <T extends FieldValues, N extends Path<T>>({
  control,
  name,
}: AmountInputProps<T, N>) => {
  const { field } = useController({ name: name, control });

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
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  // Only allow up to 2 decimal places
                  if (value.includes(".")) {
                    const [, decimal] = value.split(".");
                    if (decimal && decimal.length > 2) {
                      return;
                    }
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
                  const parsed = parseFloat(displayValue);
                  const clean = isNaN(parsed) ? 0 : parsed;

                  field.onChange(clean); // update form value
                  setDisplayValue(
                    clean > 0 ? formatCurrency(clean) : "" // update display
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
