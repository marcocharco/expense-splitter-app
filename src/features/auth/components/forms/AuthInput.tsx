import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
}

const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
}: CustomInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-item-label">{label}</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                id={name}
                type={name === "password" ? "password" : "text"}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-item-message" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
