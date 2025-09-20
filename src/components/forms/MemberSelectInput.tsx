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
import { useMemo } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

type MemberSelectInputProps<T extends FieldValues, N extends Path<T>> = {
  control: Control<T>;
  name: N;
  groupMembers: Member[];
  currentUserId: string;
  formType: "expense" | "payment";
  excludeUserId?: string;
};

const MemberSelectInput = <T extends FieldValues, N extends Path<T>>({
  control,
  name,
  groupMembers,
  currentUserId,
  formType,
  excludeUserId,
}: MemberSelectInputProps<T, N>) => {
  // Auto-determine width based on form type
  const width = formType === "payment" ? "w-full" : "w-[240px]";
  const filteredMembers = useMemo(() => {
    let list = groupMembers;

    // Simply exclude the specified user if provided
    if (excludeUserId) {
      list = list.filter((m) => m.id !== excludeUserId);
    }

    return list;
  }, [groupMembers, excludeUserId]);
  return (
    <div className="form-item">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <div className="form-label-row">
              <FormLabel className="form-item-label">
                {name === "paidBy" ? "Paid By" : "Paid To"}
              </FormLabel>
              <FormMessage className="form-item-message" />
            </div>
            <FormControl>
              <div className="input-class">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={width}>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} {member.id === currentUserId && "🫵"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
          </>
        )}
      />
    </div>
  );
};

export default MemberSelectInput;
