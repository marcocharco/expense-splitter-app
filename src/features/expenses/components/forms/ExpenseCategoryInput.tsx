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

import { Control } from "react-hook-form";

import { z } from "zod";
import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";

import { useQuery } from "@tanstack/react-query";

type ExpenseFormInputProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
  groupId: string;
};

const ExpenseCategoryInput = ({ control, groupId }: ExpenseFormInputProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories", groupId],
    queryFn: () => getExpenseCategories(groupId),
  });

  return (
    <div className="form-item">
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <>
            <FormLabel className="form-label">Category</FormLabel>
            <FormControl>
              <div className="input-class">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[240px]">
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
            <FormMessage className="form-message" />
          </>
        )}
      />
    </div>
  );
};

export default ExpenseCategoryInput;
