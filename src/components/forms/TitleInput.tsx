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
          <FormLabel className="form-label">
            {label}
            {isOptional && (
              <span className="text-muted-foreground font-normal text-sm">
                {" "}
                (optional)
              </span>
            )}
          </FormLabel>
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
            <FormMessage className="form-message" />
          </div>
        </div>
      )}
    />
  );
};

export default TitleInput;
