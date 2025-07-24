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
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <>
          <FormLabel className="form-label">Category</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
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
          </FormControl>
          <FormMessage className="form-message" />
        </>
      )}
    />
  );
};

export default ExpenseCategoryInput;
