import { useEffect, useState } from "react";

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
import { getExpenseCategories } from "@/lib/queries/getExpenseCategories";

import { Control } from "react-hook-form";

import { z } from "zod";
import { ExpenseFormSchema } from "@/lib/utils";

type ExpenseFormInputProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
};

const ExpenseCategoryInput = ({ control }: ExpenseFormInputProps) => {
  const [categories, setCategories] = useState<
    { id: string; name: string; icon: string }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getExpenseCategories(); // This must return a promise
      setCategories(result);
    };
    fetchCategories();
  }, []);

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
                {categories.map((category) => {
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
