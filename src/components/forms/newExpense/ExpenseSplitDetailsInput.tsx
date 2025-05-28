import { z } from "zod";
import { Control, UseFormReturn, useWatch } from "react-hook-form";

import { Member } from "@/types";

import { newExpenseFormSchema } from "@/lib/utils";
import { calculateTotalShares } from "@/utils/totalSharesCalculator";
import { calculateSplitCosts } from "@/utils/splitCalculator";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FormField, FormLabel, FormMessage } from "@/components/ui/form";

type ExpenseSplitDetailsInputProps = {
  groupMembers: Member[];
  control: Control<z.infer<ReturnType<typeof newExpenseFormSchema>>>;
  setValue: UseFormReturn<
    z.infer<ReturnType<typeof newExpenseFormSchema>>
  >["setValue"];
};

const ExpenseSplitDetailsInput = ({
  groupMembers,
  control,
  setValue,
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
                  : selectedMembers.filter((id: string) => id !== member.id);
                setValue("selectedMembers", newValue);
              }}
            />
            <span className="w-32">{member.name}</span>
            <span>
              {currencyFormatter.format(isSelected ? splitAmount || 0 : 0)}
            </span>
            <FormField
              name={`memberSplits.${memberIndex}.split`}
              render={({ field }) => (
                <>
                  {splitType !== "even" && (
                    <div className="relative">
                      <Input
                        placeholder="0"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        disabled={!isSelected}
                        // prettier-ignore
                        value={
                          isSelected ? (field.value === 0 ? "" : field.value) : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow up to 2 decimal places
                          if (value.includes(".")) {
                            const [, decimal] = value.split(".");
                            if (decimal && decimal.length > 2) {
                              return;
                            }
                          }
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                        className="w-32 pr-8 input-no-spinner"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                        {splitCostLabel}
                      </span>
                    </div>
                  )}
                  <FormMessage className="form-message" />
                </>
              )}
            />
          </div>
        );
      })}
    </>
  );
};

export default ExpenseSplitDetailsInput;
