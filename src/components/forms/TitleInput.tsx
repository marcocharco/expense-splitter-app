import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type TitleInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  isOptional?: boolean;
};

const TitleInput = <T extends FieldValues>({
  control,
  name,
  label = "Title",
  placeholder = "Enter a title",
  isOptional = false,
}: TitleInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <div className="form-label-row">
            <FormLabel className="form-item-label">
              {label}
              {isOptional && (
                <span className="text-muted-foreground font-normal text-sm">
                  {" "}
                  (optional)
                </span>
              )}
            </FormLabel>
            <FormMessage className="form-item-message" />
          </div>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type="text"
                id={name}
                {...field}
                value={field.value || ""}
                onChange={field.onChange}
              />
            </FormControl>
          </div>
        </div>
      )}
    />
  );
};

export default TitleInput;
