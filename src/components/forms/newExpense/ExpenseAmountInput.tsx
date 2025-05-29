import { z } from "zod";
import { Control } from "react-hook-form";

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
                onBlur={(e) => {
                  let value = e.target.value;

                  // Remove non-digit characters except decimal point
                  value = value.replace(/[^\d.]/g, "");

                  // Remove leading zeros
                  value = value.replace(/^0+(?=\d)/, "");

                  // Remove trailing zeros after decimal
                  if (value.includes(".")) {
                    value = value.replace(/\.?0+$/, "");
                  }

                  // Handle empty or just decimal point
                  if (value === "" || value === ".") {
                    value = "";
                  }

                  // Update input and form
                  e.target.value = value;
                  field.onChange(parseFloat(value) || 0);
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
