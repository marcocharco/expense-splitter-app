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

import { Member } from "@/types";

type ExpensePaidByInput = {
  groupMembers: Member[];
  currentUserId: string;
};

const ExpensePaidByInput = ({
  groupMembers,
  currentUserId,
}: ExpensePaidByInput) => {
  return (
    <FormField
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
