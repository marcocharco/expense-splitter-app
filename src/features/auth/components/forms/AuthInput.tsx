import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath } from "react-hook-form";

import { z } from "zod";
import { authFormSchema } from "@/features/auth/schemas/authFormSchema";

interface CustomInputProps {
  control: Control<z.infer<ReturnType<typeof authFormSchema>>>;
  name: FieldPath<z.infer<ReturnType<typeof authFormSchema>>>;
  label: string;
  placeholder: string;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
}: CustomInputProps) => {
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
