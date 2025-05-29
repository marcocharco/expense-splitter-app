import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { newExpenseFormSchema } from "@/lib/utils";

import { Member } from "@/types";
import { Control } from "react-hook-form";
import { z } from "zod";

type ExpensePaidByInputProps = {
  groupMembers: Member[];
  currentUserId: string;
  control: Control<z.infer<ReturnType<typeof newExpenseFormSchema>>>;
};

const ExpensePaidByInput = ({
  groupMembers,
  currentUserId,
  control,
}: ExpensePaidByInputProps) => {
  return (
    <FormField
      control={control}
      name="paidBy"
      render={({ field }) => (
        <>
          <FormLabel className="form-label">Paid By</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {groupMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} {member.id === currentUserId && "(you)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="form-message" />
        </>
      )}
    />
  );
};

export default ExpensePaidByInput;
