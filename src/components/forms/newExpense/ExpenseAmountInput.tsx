import { z } from "zod";
import { Control } from "react-hook-form";

import { newExpenseFormSchema } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ExpenseAmountInputProps = {
  control: Control<z.infer<ReturnType<typeof newExpenseFormSchema>>>;
};

const ExpenseAmountInput = ({ control }: ExpenseAmountInputProps) => {
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
                placeholder="0.00"
                className="input-class input-no-spinner"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                id="amount"
                {...field}
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow up to 2 decimal places
                  if (value.includes(".")) {
                    const [, decimal] = value.split(".");
                    if (decimal && decimal.length > 2) {
                      return;
                    }
                  }
                  field.onChange(value === "" ? 0 : Number(value));
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
