import { z } from "zod";
import { Control, UseFormReturn, useWatch } from "react-hook-form";

import { Member } from "@/features/users/types/user";

import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

  const areAllMembersSelected = selectedMembers?.length === groupMembers.length;

  const handleSelectAllToggle = () => {
    const newValue = areAllMembersSelected
      ? [] // Deselect all
      : groupMembers.map((member) => member.id); // Select all

    const total = getSelectedTotal(memberSplits, newValue);
    const overLimit = isOverTotalLimit(total, splitType, currentAmount);

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
  };

  return (
    <div className="form-item">
      <div className="flex items-center justify-between">
        <div className="form-label-row">
          <FormLabel className="form-item-label">Splits</FormLabel>
          <FormField
            control={control}
            name="selectedMembers"
            render={() => <FormMessage className="form-item-message" />}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAllToggle}
          className="text-xs"
        >
          {areAllMembersSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <FormField
        control={control}
        name="memberSplits"
        render={() => (
          <div className="flex flex-col gap-y-4 mt-2">
            {groupMembers.map((member) => {
              const isSelected = selectedMembers.includes(member.id);

              return (
                <FormItem
                  key={member.id}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        id={member.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(selectedMembers || []), member.id]
                            : selectedMembers.filter(
                                (id: string) => id !== member.id
                              );

                          const total = getSelectedTotal(
                            memberSplits,
                            newValue
                          );
                          const overLimit = isOverTotalLimit(
                            total,
                            splitType,
                            currentAmount
                          );

                          if (overLimit) {
                            setError("memberSplits", {
                              type: "manual",
                              message:
                                splitType === "custom" ||
                                splitType === "percentage"
                                  ? errorMsgForLimit(splitType, currentAmount)
                                  : "Invalid split type",
                            });
                          } else {
                            clearErrors("memberSplits");
                          }

                          setValue("selectedMembers", newValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor={member.id}
                      className="font-normal text-base min-w-0"
                    >
                      <span className="cursor-pointer">{member.name}</span>
                    </FormLabel>
                  </div>
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
                </FormItem>
              );
            })}

            <FormMessage className="form-item-message" />
          </div>
        )}
      />
    </div>
  );
};

export default ExpenseSplitDetailsInput;
