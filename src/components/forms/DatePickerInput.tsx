import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { Control, FieldValues, Path } from "react-hook-form";
import { DateToYMD, formatDisplayDate, YMDToDate } from "@/utils/formatDate";

type DatePickerInputProps<T extends FieldValues, N extends Path<T>> = {
  control: Control<T>;
  name: N;
};

const DatePickerInput = <T extends FieldValues, N extends Path<T>>({
  control,
  name,
}: DatePickerInputProps<T, N>) => {
  return (
    <div className="form-item">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <div className="form-label-row">
              <FormLabel className="form-item-label">Date</FormLabel>
              <FormMessage className="form-item-message" />
            </div>
            <FormControl>
              <div className="input-class">
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {field.value ? (
                        formatDisplayDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={YMDToDate(field.value)}
                      onSelect={(date) => {
                        field.onChange(date ? DateToYMD(date) : "");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </FormControl>
          </>
        )}
      />
    </div>
  );
};

export default DatePickerInput;
