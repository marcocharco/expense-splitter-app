import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath } from "react-hook-form";

import { z } from "zod";
import { newExpenseFormSchema } from "@/lib/utils";

interface ExpenseFormInputProps {
  control: Control<z.infer<ReturnType<typeof newExpenseFormSchema>>>;
  name: FieldPath<z.infer<ReturnType<typeof newExpenseFormSchema>>>;
  label: string;
  placeholder: string;
}

const ExpenseFormInput = ({
  control,
  name,
  label,
  placeholder,
}: ExpenseFormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={name === "amount" ? "number" : "text"}
                step={name === "amount" ? "0.01" : undefined}
                min={name === "amount" ? "0" : undefined}
                id={name}
                {...field}
                value={
                  name === "amount" && field.value === 0 ? "" : field.value
                }
                onChange={(e) => {
                  if (name === "amount") {
                    const value = e.target.value;
                    // Only allow up to 2 decimal places
                    if (value.includes(".")) {
                      const [, decimal] = value.split(".");
                      if (decimal && decimal.length > 2) {
                        return;
                      }
                    }
                    field.onChange(value === "" ? 0 : Number(value));
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormMessage className="form-message" />
          </div>
        </div>
      )}
    />
  );
};

export default ExpenseFormInput;
