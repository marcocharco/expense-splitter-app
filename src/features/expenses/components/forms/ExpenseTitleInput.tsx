import { z } from "zod";
import { Control } from "react-hook-form";

import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ExpenseFormInputProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
};

const ExpenseTitleInput = ({ control }: ExpenseFormInputProps) => {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">Title</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder="e.g. Grocery bill, Flight tickets, etc."
                className="input-class"
                type="text"
                id="title"
                {...field}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage className="form-message" />
          </div>
        </div>
      )}
    />
  );
};

export default ExpenseTitleInput;
