import { FormControl, FormField, FormMessage } from "@/components/ui/form";
import { Tabs, FormTabsList, FormTabsTrigger } from "@/components/ui/tabs";
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
          <FormControl>
            <Tabs
              value={field.value}
              onValueChange={field.onChange}
              className="w-fit"
            >
              <FormTabsList className="h-7 p-0.5">
                <FormTabsTrigger
                  value="even"
                  className="min-w-[40px] px-2 py-0.5 h-full"
                  title="Even split"
                >
                  {splitTypeSymbols.even}
                </FormTabsTrigger>
                <FormTabsTrigger
                  value="percentage"
                  className="min-w-[40px] px-2 py-0.5 h-full"
                  title="Percentage split"
                >
                  {splitTypeSymbols.percentage}
                </FormTabsTrigger>
                <FormTabsTrigger
                  value="shares"
                  className="min-w-[40px] px-2 py-0.5 h-full"
                  title="Shares split"
                >
                  {splitTypeSymbols.shares}
                </FormTabsTrigger>
                <FormTabsTrigger
                  value="custom"
                  className="min-w-[40px] px-2 py-0.5 h-full"
                  title="Custom split"
                >
                  {splitTypeSymbols.custom}
                </FormTabsTrigger>
              </FormTabsList>
            </Tabs>
          </FormControl>
          <FormMessage className="text-xs mt-1" />
        </div>
      )}
    />
  );
};

export default CompactSplitTypeSelect;
