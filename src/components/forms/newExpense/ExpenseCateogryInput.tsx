import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

import { z } from "zod";
import { newExpenseFormSchema } from "@/lib/utils";

type ExpenseFormInputProps = {
  control: Control<z.infer<ReturnType<typeof newExpenseFormSchema>>>;
};

const ExpenseCategoryInput = ({ control }: ExpenseFormInputProps) => {
  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">Category</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder="Choose a category"
                className="input-class"
                type="text"
                id="category"
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

export default ExpenseCategoryInput;
