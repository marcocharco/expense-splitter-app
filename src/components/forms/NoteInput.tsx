import { PaymentFormSchema } from "@/features/payments/schemas/paymentFormSchema";
import React from "react";
import { Control } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type NoteInputProps = {
  control: Control<z.infer<ReturnType<typeof PaymentFormSchema>>>;
};

const NoteInput = ({ control }: NoteInputProps) => {
  return (
    <FormField
      control={control}
      name="note"
      render={({ field }) => (
        <div className="form-item">
          <div className="form-label-row">
            <FormLabel className="form-item-label">
              Note
              <span className="text-muted-foreground font-normal text-sm">
                {" "}
                (optional)
              </span>
            </FormLabel>
            <FormMessage className="form-item-message" />
          </div>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder="e.g. e-transfer, cash, etc."
                className="input-class"
                type="text"
                id="note"
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

export default NoteInput;
