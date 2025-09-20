import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, FormTabsList, FormTabsTrigger } from "@/components/ui/tabs";

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
            <div className="form-label-row">
              <FormLabel className="form-item-label">Split Type</FormLabel>
              <FormMessage className="form-item-message" />
            </div>
            <FormControl>
              <div className="input-class">
                <Tabs value={field.value} onValueChange={field.onChange}>
                  <FormTabsList>
                    <FormTabsTrigger value="even">Even</FormTabsTrigger>
                    <FormTabsTrigger value="percentage">
                      Percentage
                    </FormTabsTrigger>
                    <FormTabsTrigger value="shares">Shares</FormTabsTrigger>
                    <FormTabsTrigger value="custom">Custom</FormTabsTrigger>
                  </FormTabsList>
                </Tabs>
              </div>
            </FormControl>
          </>
        )}
      />
    </div>
  );
};

export default ExpenseSplitTypeInput;
