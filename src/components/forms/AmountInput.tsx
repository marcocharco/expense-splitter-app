"use client";

import { useState, useRef, useEffect } from "react";
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
  variant?: "default" | "compact";
  label?: string;
  onFocusChange?: (focused: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

const AmountInput = <T extends FieldValues, N extends Path<T>>({
  control,
  name,
  variant = "default",
  label = "Amount",
  onFocusChange,
  inputRef: externalInputRef,
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

  // compact variant states
  const [isFocused, setIsFocused] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);

  // use external ref if provided, otherwise use internal ref
  const inputRef = externalInputRef || internalInputRef;

  const hasValue = field.value && field.value > 0;
  const showAsText = variant === "compact" && hasValue && !isFocused;

  // Sync displayValue with external field value changes (e.g., from form.setValue)
  // Only update when not focused to avoid interfering with user input
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(field.value == 0 ? "" : formatCurrency(field.value));
    }
  }, [field.value, isFocused]);

  const handleTextClick = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, isValid } = validateNumericInput(e.target.value);

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
  };

  const handleBlur = () => {
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
    setDisplayValue(completedValue > 0 ? formatCurrency(completedValue) : ""); // update display value with currency format

    // Set isFocused to false for both variants to prevent useEffect interference
    setTimeout(() => {
      setIsFocused(false);
      if (variant === "compact") {
        onFocusChange?.(false);
      }
    }, 0);
  };

  const handleFocus = () => {
    setDisplayValue(field.value === 0 ? "" : field.value?.toString());
    // Set isFocused to true for both variants to prevent useEffect interference
    setIsFocused(true);
    if (variant === "compact") {
      onFocusChange?.(true);
    }
  };

  // compact variant rendering
  if (variant === "compact") {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex flex-col">
            <FormControl>
              <div className="relative">
                {showAsText ? (
                  <div
                    className="group h-9 flex items-center text-muted-foreground px-1 rounded outline-none focus:ring-2 focus:ring-ring/20 hover:cursor-text"
                    onClick={handleTextClick}
                    onFocus={handleTextClick}
                    tabIndex={0}
                  >
                    <span className="relative inline-block">
                      {formatCurrency(field.value)}
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-current opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </span>
                  </div>
                ) : (
                  <Input
                    placeholder="$0.00"
                    className="h-9 w-full input-no-spinner"
                    type="text"
                    inputMode="decimal"
                    autoFocus={isFocused}
                    {...field}
                    ref={(e) => {
                      field.ref(e);
                      if (inputRef && "current" in inputRef) {
                        (
                          inputRef as React.MutableRefObject<HTMLInputElement | null>
                        ).current = e;
                      }
                    }}
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                )}
              </div>
            </FormControl>
            <FormMessage className="text-xs mt-1" />
          </div>
        )}
      />
    );
  }

  // default variant rendering
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <div className="form-label-row">
            <FormLabel className="form-item-label">{label}</FormLabel>
            <FormMessage className="form-item-message" />
          </div>
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
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
          </div>
        </div>
      )}
    />
  );
};

export default AmountInput;
