import { Checkbox } from "@/components/ui/checkbox";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Control, FieldValues, Path } from "react-hook-form";

type SelectableItem = {
  id: string;
  label: string;
};

type MultiSelectInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  items: SelectableItem[];
};

const MultiSelectInput = <T extends FieldValues>({
  control,
  name,
  items,
}: MultiSelectInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col h-full space-y-4">
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              checked={
                field.value.length === items.length
                  ? true
                  : field.value.length > 0
                  ? "indeterminate"
                  : false
              }
              onCheckedChange={(checked) => {
                return typeof checked === "boolean"
                  ? checked
                    ? field.onChange(items.map((item) => item.id))
                    : field.onChange([])
                  : field.onChange(items.map((item) => item.id));
              }}
            />
            <span className="text-xs font-medium">
              {field.value.length === items.length
                ? "Deselect All"
                : "Select All"}
            </span>
          </div>
          <div className="flex-1 min-h-0 max-h-[200px] overflow-y-auto space-y-2 pr-2">
            {items.map((item) => {
              return (
                <FormItem
                  key={item.id}
                  className="flex flex-row items-center gap-2"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value.includes(item.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, item.id])
                          : field.onChange(
                              field.value?.filter(
                                (value: string) => value !== item.id
                              )
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              );
            })}
          </div>
          <div className="text-muted-foreground font-normal text-sm">
            {field.value.length} items selected
          </div>
        </div>
      )}
    />
  );
};

export default MultiSelectInput;
