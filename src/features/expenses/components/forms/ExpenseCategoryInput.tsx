"use client";

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
import { getExpenseCategories } from "@/features/expenses/queries/getExpenseCategories";

import { Control, FieldValues, Path } from "react-hook-form";

import { useQuery } from "@tanstack/react-query";

type ExpenseFormInputProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  groupId: string;
};

const ExpenseCategoryInput = <T extends FieldValues = FieldValues>({
  control,
  groupId,
}: ExpenseFormInputProps<T>) => {
  const { data: categories } = useQuery({
    queryKey: ["categories", groupId],
    queryFn: () => getExpenseCategories(groupId),
  });

  return (
    <div className="form-item">
      <FormField
        control={control}
        name={"category" as Path<T>}
        render={({ field }) => (
          <>
            <div className="form-label-row">
              <FormLabel className="form-item-label">Category</FormLabel>
              <FormMessage className="form-item-message" />
            </div>
            <FormControl>
              <div className="input-class">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => {
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
          </>
        )}
      />
    </div>
  );
};

export default ExpenseCategoryInput;
