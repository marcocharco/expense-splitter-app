"use client";

import {
  Control,
  useFieldArray,
  useWatch,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { Member } from "@/types";
import { Button } from "@/components/ui/button";
import {
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import TitleInput from "@/components/forms/TitleInput";
import AmountInput from "@/components/forms/AmountInput";
import ExpenseSplitTypeInput from "@/features/expenses/components/forms/ExpenseSplitTypeInput";
import { Checkbox } from "@/components/ui/checkbox";
import MemberSplitRow from "@/features/expenses/components/forms/MemberSplitRow";
import {
  getSelectedTotal,
  isOverTotalLimit,
  errorMsgForLimit,
} from "@/features/expenses/utils/splitsHelpers";
import { X } from "lucide-react";
import { MultiItemExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";

type ExpenseMultiItemSectionProps = {
  control: Control<z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>>;
  setValue: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setValue"];
  setError: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setError"];
  clearErrors: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["clearErrors"];
  groupMembers: Member[];
};

const ExpenseMultiItemSection = ({
  control,
  setValue,
  setError,
  clearErrors,
  groupMembers,
}: ExpenseMultiItemSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleAddItem = () => {
    append({
      title: "",
      amount: 0,
      splitType: "even",
      memberSplits: groupMembers.map((m) => ({ userId: m.id, weight: 0 })),
      selectedMembers: [],
    });
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="form-item-label">Items</FormLabel>
        <Button
          type="button"
          onClick={handleAddItem}
          variant="outline"
          size="sm"
        >
          Add Item
        </Button>
      </div>

      <div className="space-y-6 max-h-fit overflow-y-auto pr-2">
        {fields.map((field, index) => (
          <ItemCard
            key={field.id}
            index={index}
            control={control}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
            groupMembers={groupMembers}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

type ItemCardProps = {
  index: number;
  control: Control<z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>>;
  setValue: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setValue"];
  setError: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["setError"];
  clearErrors: UseFormReturn<
    z.infer<ReturnType<typeof MultiItemExpenseFormSchema>>
  >["clearErrors"];
  groupMembers: Member[];
  onRemove: () => void;
  canRemove: boolean;
};

const ItemCard = ({
  index,
  control,
  setValue,
  setError,
  clearErrors,
  groupMembers,
  onRemove,
  canRemove,
}: ItemCardProps) => {
  const currentAmount = useWatch({ control, name: `items.${index}.amount` });
  const splitType = useWatch({ control, name: `items.${index}.splitType` });
  const selectedMembers = useWatch({
    control,
    name: `items.${index}.selectedMembers`,
  });
  const memberSplits = useWatch({
    control,
    name: `items.${index}.memberSplits`,
  });

  const areAllMembersSelected = selectedMembers?.length === groupMembers.length;

  const handleSelectAllToggle = () => {
    const newValue = areAllMembersSelected
      ? []
      : groupMembers.map((member) => member.id);

    const total = getSelectedTotal(memberSplits, newValue);
    const overLimit = isOverTotalLimit(total, splitType, currentAmount);

    if (overLimit) {
      setError(`items.${index}.memberSplits`, {
        type: "manual",
        message:
          splitType === "custom" || splitType === "percentage"
            ? errorMsgForLimit(splitType, currentAmount)
            : "Invalid split type",
      });
    } else {
      clearErrors(`items.${index}.memberSplits`);
    }

    setValue(`items.${index}.selectedMembers`, newValue);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-medium">Item {index + 1}</h4>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <TitleInput
        control={control}
        name={`items.${index}.title`}
        label="Item Name"
        placeholder="e.g. Pizza, Drinks, etc."
      />

      <AmountInput control={control} name={`items.${index}.amount`} />

      <ExpenseSplitTypeInput
        control={control}
        name={`items.${index}.splitType`}
      />

      {/* Split Details */}
      <div className="form-item">
        <div className="flex items-center justify-between">
          <div className="form-label-row">
            <FormLabel className="form-item-label">Splits</FormLabel>
            <FormField
              control={control}
              name={`items.${index}.selectedMembers`}
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
          name={`items.${index}.memberSplits`}
          render={() => (
            <div className="flex flex-col gap-y-4 mt-2">
              {groupMembers.map((member) => {
                const isSelected = selectedMembers?.includes(member.id);

                return (
                  <FormItem
                    key={member.id}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id={`${index}-${member.id}`}
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
                              setError(`items.${index}.memberSplits`, {
                                type: "manual",
                                message:
                                  splitType === "custom" ||
                                  splitType === "percentage"
                                    ? errorMsgForLimit(splitType, currentAmount)
                                    : "Invalid split type",
                              });
                            } else {
                              clearErrors(`items.${index}.memberSplits`);
                            }

                            setValue(
                              `items.${index}.selectedMembers`,
                              newValue
                            );
                          }}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor={`${index}-${member.id}`}
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
                      fieldPrefix={`items.${index}`}
                    />
                  </FormItem>
                );
              })}
              <FormMessage className="form-item-message" />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ExpenseMultiItemSection;
