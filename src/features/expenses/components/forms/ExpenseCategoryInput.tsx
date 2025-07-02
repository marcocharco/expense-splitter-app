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
import { ExpenseFormSchema } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";

type ExpenseFormInputProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
};

const ExpenseCategoryInput = ({ control }: ExpenseFormInputProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getExpenseCategories(),
  });

  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <>
          <FormLabel className="form-label">Category</FormLabel>
          <FormControl>
            <Select
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => {
                  return (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
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
