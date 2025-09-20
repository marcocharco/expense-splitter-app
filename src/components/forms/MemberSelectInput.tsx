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
};

const MemberSelectInput = <T extends FieldValues, N extends Path<T>>({
  control,
  name,
  groupMembers,
  currentUserId,
  formType,
}: MemberSelectInputProps<T, N>) => {
  const filteredMembers = useMemo(() => {
    let list = groupMembers;

    if (formType === "payment" && currentUserId) {
      list = list.filter((m) => m.id !== currentUserId);
    }

    return list;
  }, [groupMembers, formType, currentUserId]);
  return (
    <div className="form-item">
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <FormLabel className="form-item-label">
              {formType === "expense" ? "Paid By" : "Paid To"}
            </FormLabel>
            <FormControl>
              <div className="input-class">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} {member.id === currentUserId && "(you)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
            <FormMessage className="form-item-message" />
          </>
        )}
      />
    </div>
  );
};

export default MemberSelectInput;
