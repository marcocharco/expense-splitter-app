import { z } from "zod";
import { Control, UseFormReturn, useWatch } from "react-hook-form";

import { Member } from "@/types";

import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";

import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";
import MemberSplitRow from "@/features/expenses/components/forms/MemberSplitRow";

import {
  getSelectedTotal,
  isOverTotalLimit,
  errorMsgForLimit,
} from "@/features/expenses/utils/splitsHelpers";

type ExpenseSplitDetailsInputProps = {
  groupMembers: Member[];
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
  setValue: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["setValue"];
  setError: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["setError"];
  clearErrors: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["clearErrors"];
};

const ExpenseSplitDetailsInput = ({
  groupMembers,
  control,
  setValue,
  setError,
  clearErrors,
}: ExpenseSplitDetailsInputProps) => {
  const currentAmount = useWatch({ control: control, name: "amount" });
  const splitType = useWatch({ control: control, name: "splitType" });
  const selectedMembers = useWatch({
    control: control,
    name: "selectedMembers",
  });
  const memberSplits = useWatch({
    control: control,
    name: "memberSplits",
  });

  return (
    <>
      <FormLabel className="form-label">Splits</FormLabel>
      <FormField
        control={control}
        name="selectedMembers"
        render={() => <FormMessage className="form-message" />}
      />
      <FormField
        control={control}
        name="memberSplits"
        render={() => (
          <>
            {groupMembers.map((member) => {
              const isSelected = selectedMembers.includes(member.id);

              return (
                <div key={member.id} className="flex items-center space-x-4">
                  <Checkbox
                    id={member.id}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(selectedMembers || []), member.id]
                        : selectedMembers.filter(
                            (id: string) => id !== member.id
                          );

                      const total = getSelectedTotal(memberSplits, newValue);
                      const overLimit = isOverTotalLimit(
                        total,
                        splitType,
                        currentAmount
                      );

                      if (overLimit) {
                        setError("memberSplits", {
                          type: "manual",
                          message:
                            splitType === "custom" || splitType === "percentage"
                              ? errorMsgForLimit(splitType, currentAmount)
                              : "Invalid split type",
                        });
                      } else {
                        clearErrors("memberSplits");
                      }

                      setValue("selectedMembers", newValue);
                    }}
                  />
                  <span className="w-32">{member.name}</span>
                  <MemberSplitRow
                    control={control}
                    member={member}
                    isSelected={isSelected}
                    splitType={splitType}
                    memberSplits={memberSplits}
                    selectedMembers={selectedMembers}
                    currentAmount={currentAmount}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                </div>
              );
            })}

            <FormMessage className="form-message" />
          </>
        )}
      />
    </>
  );
};

export default ExpenseSplitDetailsInput;
