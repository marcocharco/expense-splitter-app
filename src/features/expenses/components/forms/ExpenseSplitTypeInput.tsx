import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";
import { Control } from "react-hook-form";
import { z } from "zod";

type ExpenseSplitTypeInputProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
};

const ExpenseSplitTypeInput = ({ control }: ExpenseSplitTypeInputProps) => {
  return (
    <div className="form-item">
      <FormField
        control={control}
        name="splitType"
        render={({ field }) => (
          <>
            <FormLabel className="form-item-label">Split Type</FormLabel>
            <FormControl>
              <div className="input-class">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select a split type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="even">Even</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="shares">Shares</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
            <FormMessage className="form-item-message" />
          </>
        )}
      />
    </div>
  );
};

export default ExpenseSplitTypeInput;
