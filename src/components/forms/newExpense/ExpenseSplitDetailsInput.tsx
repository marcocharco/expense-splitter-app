import { z } from "zod";
import { Control, UseFormReturn, useWatch } from "react-hook-form";

import { Member } from "@/types";

import { ExpenseFormSchema } from "@/lib/utils";
import { calculateTotalShares } from "@/utils/totalSharesCalculator";
import { calculateSplitCosts } from "@/utils/splitCalculator";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";

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
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
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
  const memberIndexMap = Object.fromEntries(
    memberSplits.map((m, i) => [m.userId, i])
  );
  const splitCosts =
    calculateSplitCosts({
      type: splitType,
      totalAmount: currentAmount,
      memberSplits: memberSplits,
      selectedMembers: selectedMembers,
    }) || [];
  const totalShares = calculateTotalShares(memberSplits, selectedMembers);
  const splitCostLabel = (() => {
    switch (splitType) {
      case "even":
        return "";
      case "percentage":
        return "%";
      case "shares":
        return `/${totalShares}`;
      case "custom":
        return "$";
      default:
        return "";
    }
  })();
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
            <FormMessage className="form-message" />

            {groupMembers.map((member) => {
              const isSelected = selectedMembers.includes(member.id);
              const memberIndex = memberIndexMap[member.id];
              const splitAmount =
                splitCosts.find((s) => s.userId === member.id)?.amount ?? 0;

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
                      setValue("selectedMembers", newValue);
                    }}
                  />
                  <span className="w-32">{member.name}</span>
                  <span>
                    {currencyFormatter.format(
                      isSelected ? splitAmount || 0 : 0
                    )}
                  </span>
                  <FormField
                    control={control}
                    name={`memberSplits.${memberIndex}.split`}
                    render={({ field }) => (
                      <>
                        <div className="relative">
                          <Input
                            placeholder={
                              isSelected && splitType !== "even" ? "0" : "-"
                            }
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            disabled={!isSelected || splitType === "even"}
                            value={
                              isSelected
                                ? field.value === 0
                                  ? ""
                                  : field.value
                                : ""
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.includes(".")) {
                                const [, decimal] = value.split(".");
                                if (decimal && decimal.length > 2) {
                                  return;
                                }
                              }

                              const numValue = value === "" ? 0 : Number(value);

                              // Get new splits array with this field's value updated
                              const updatedSplits = [...memberSplits];
                              updatedSplits[memberIndex] = {
                                ...updatedSplits[memberIndex],
                                split: numValue,
                              };

                              const included = selectedMembers.map(
                                (id) =>
                                  updatedSplits.find((m) => m.userId === id)
                                    ?.split || 0
                              );
                              const total = included.reduce(
                                (acc, val) => acc + val,
                                0
                              );

                              // Check overage
                              const isOverTotal =
                                splitType === "percentage"
                                  ? total > 100
                                  : splitType === "custom"
                                  ? total > currentAmount
                                  : false;

                              if (isOverTotal) {
                                setError("memberSplits", {
                                  type: "manual",
                                  message:
                                    splitType === "percentage"
                                      ? "Total percentage cannot exceed 100%"
                                      : `Total splits cannot exceed amount ($${currentAmount})`,
                                });
                              } else {
                                clearErrors("memberSplits");
                              }

                              const maxValue =
                                splitType === "percentage"
                                  ? 100
                                  : splitType === "custom"
                                  ? currentAmount
                                  : Infinity;

                              if (numValue > maxValue) {
                                setError(`memberSplits.${memberIndex}.split`, {
                                  type: "manual",
                                  message:
                                    splitType === "percentage"
                                      ? "Percentage cannot exceed 100%"
                                      : `Custom split cannot exceed total amount ($${currentAmount})`,
                                });
                                if (splitType === "percentage") return;
                              }

                              if (numValue < 0) {
                                return;
                              }

                              // Update field
                              field.onChange(numValue);
                            }}
                            onBlur={(e) => {
                              let value = e.target.value;

                              // Remove non-digit characters except decimal point
                              value = value.replace(/[^\d.]/g, "");

                              // Remove leading zeros
                              value = value.replace(/^0+(?=\d)/, "");

                              // Remove trailing zeros after decimal
                              if (value.includes(".")) {
                                value = value.replace(/\.?0+$/, "");
                              }

                              // Handle empty or just decimal point
                              if (value === "" || value === ".") {
                                value = "";
                              }

                              // Update input and form
                              e.target.value = value;
                              field.onChange(parseFloat(value) || 0);
                            }}
                            className="w-32 pr-8 input-no-spinner"
                            onWheel={(e) => e.currentTarget.blur()}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                            {splitCostLabel}
                          </span>
                        </div>
                        <FormMessage className="form-message" />
                      </>
                    )}
                  />
                </div>
              );
            })}
          </>
        )}
      />
    </>
  );
};

export default ExpenseSplitDetailsInput;
