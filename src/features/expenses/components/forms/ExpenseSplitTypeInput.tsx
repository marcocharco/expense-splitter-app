import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, FormTabsList, FormTabsTrigger } from "@/components/ui/tabs";

import { Control, FieldPath, FieldValues } from "react-hook-form";

type ExpenseSplitTypeInputProps<T extends FieldValues> = {
  control: Control<T>;
  name?: FieldPath<T>;
};

const ExpenseSplitTypeInput = <T extends FieldValues>({
  control,
  name = "splitType" as FieldPath<T>,
}: ExpenseSplitTypeInputProps<T>) => {
  return (
    <div className="form-item">
      <FormField
        control={control}
        name={name}
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
