import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Control, FieldPath, FieldValues } from "react-hook-form";

type CompactSplitTypeSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name?: FieldPath<T>;
};

const splitTypeSymbols: Record<string, string> = {
  even: "=",
  percentage: "%",
  shares: "/",
  custom: "$",
};

const splitTypeNames: Record<string, string> = {
  even: "Even",
  percentage: "Percentage",
  shares: "Shares",
  custom: "Custom",
};

const CompactSplitTypeSelect = <T extends FieldValues>({
  control,
  name = "splitType" as FieldPath<T>,
}: CompactSplitTypeSelectProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col">
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="h-9 w-[60px]">
                <SelectValue>
                  {splitTypeSymbols[field.value] || "="}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent data-ignore-outside-click>
              <SelectItem value="even">
                {splitTypeSymbols.even} {splitTypeNames.even}
              </SelectItem>
              <SelectItem value="percentage">
                {splitTypeSymbols.percentage} {splitTypeNames.percentage}
              </SelectItem>
              <SelectItem value="shares">
                {splitTypeSymbols.shares} {splitTypeNames.shares}
              </SelectItem>
              <SelectItem value="custom">
                {splitTypeSymbols.custom} {splitTypeNames.custom}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-xs mt-1" />
        </div>
      )}
    />
  );
};

export default CompactSplitTypeSelect;
