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
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
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
              <label>
                {field.value.length === items.length
                  ? "Deselect All"
                  : "Select All"}
              </label>
            </div>
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
            <div className="text-muted-foreground font-normal text-sm">
              {field.value.length} items selected
            </div>
          </>
        )}
      />
    </>
  );
};

export default MultiSelectInput;
