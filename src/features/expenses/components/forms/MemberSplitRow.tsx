import { FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Member, SplitType } from "@/types";
import {
  Control,
  FieldValues,
  Path,
  useController,
  UseFormReturn,
} from "react-hook-form";

import {
  getSelectedTotal,
  isOverTotalLimit,
  errorMsgForLimit,
} from "@/features/expenses/utils/splitsHelpers";
import { useEffect, useCallback, useState } from "react";

import { calculateTotalShares } from "@/features/expenses/utils/totalSharesCalculator";
import { calculateSplitCosts } from "@/features/expenses/utils/splitCalculator";
import { formatCurrency } from "@/utils/formatCurrency";
import { validateNumericInput } from "@/utils/validateNumericInput";
import { Parser } from "expr-eval";

type MemberSplitRowProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  member: Member;
  isSelected: boolean;
  splitType: SplitType;
  memberSplits: {
    userId: string;
    weight: number;
  }[];
  selectedMembers: string[];
  currentAmount: number;
  setError: UseFormReturn<T>["setError"];
  clearErrors: UseFormReturn<T>["clearErrors"];
  fieldPrefix?: string;
};

const MemberSplitRow = <T extends FieldValues = FieldValues>({
  control,
  member,
  isSelected,
  splitType,
  memberSplits,
  selectedMembers,
  currentAmount,
  setError,
  clearErrors,
  fieldPrefix = "",
}: MemberSplitRowProps<T>) => {
  const memberIndexMap = Object.fromEntries(
    memberSplits.map((m, i) => [m.userId, i])
  );
  const memberIndex = memberIndexMap[member.id];
  const memberSplitsPath = fieldPrefix
    ? `${fieldPrefix}.memberSplits`
    : "memberSplits";
  const selectedMembersPath = fieldPrefix
    ? `${fieldPrefix}.selectedMembers`
    : "selectedMembers";

  const splitCosts =
    calculateSplitCosts({
      type: splitType,
      totalAmount: currentAmount,
      memberSplits: memberSplits,
      selectedMembers: selectedMembers,
    }) || [];
  const splitAmount =
    splitCosts.find((s) => s.userId === member.id)?.amount ?? 0;

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

  const checkTotal = useCallback(
    (
      updated: {
        userId: string;
        weight: number;
      }[]
    ) => {
      const total = getSelectedTotal(updated, selectedMembers);

      if (isOverTotalLimit(total, splitType, currentAmount)) {
        setError(memberSplitsPath as Path<T>, {
          type: "manual",
          message:
            splitType === "custom" || splitType === "percentage"
              ? errorMsgForLimit(splitType, currentAmount)
              : "Invalid split type",
        });
      } else {
        clearErrors(memberSplitsPath as Path<T>);
      }
    },
    [
      selectedMembers,
      splitType,
      currentAmount,
      setError,
      clearErrors,
      memberSplitsPath,
    ]
  );

  const { field } = useController({
    name: `${memberSplitsPath}.${memberIndex}.weight` as Path<T>,
    control,
  });

  const [displayValue, setDisplayValue] = useState(
    field.value == 0 ? "" : formatCurrency(field.value)
  );

  useEffect(() => {
    if (!field.value) {
      setDisplayValue("");
    }
    if (field.value === 0) {
      setDisplayValue("");
    }
  }, [field.value]);

  const parser = new Parser({
    operators: {
      add: true,
      concatenate: false,
      conditional: false,
      divide: true,
      factorial: false,
      multiply: true,
      power: false,
      remainder: false,
      subtract: true,

      // Disable and, or, not, <, ==, !=, etc.
      logical: false,
      comparison: false,

      // Disable 'in' and = operators
      in: false,
      assignment: false,
    },
  });

  useEffect(() => {
    clearErrors([memberSplitsPath as Path<T>, selectedMembersPath as Path<T>]);
    checkTotal(memberSplits);
  }, [
    splitType,
    checkTotal,
    memberSplits,
    clearErrors,
    memberSplitsPath,
    selectedMembersPath,
  ]);

  return (
    <FormField
      control={control}
      name={`${memberSplitsPath}.${memberIndex}.weight` as Path<T>}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          {/* Split amount previews */}
          <span className="w-20 text-right text-sm text-muted-foreground shrink-0">
            {formatCurrency(isSelected ? splitAmount || 0 : 0)}
          </span>
          {/* Split inputs */}
          <div className="relative shrink-0">
            <Input
              placeholder={isSelected && splitType !== "even" ? "0" : "-"}
              type="text"
              inputMode="decimal"
              disabled={!isSelected || splitType === "even"}
              value={isSelected && splitType !== "even" ? displayValue : ""}
              onChange={(e) => {
                const { value, isValid } = validateNumericInput(e.target.value);

                if (!isValid) {
                  return;
                }

                // limit number of digits to 5 on input preventing overly long inputs
                const numValue = parseFloat(value) || 0;
                if (numValue >= 99999) {
                  return;
                }

                // check new splits total after current input
                const updated = [...memberSplits];

                updated[memberIndex] = {
                  ...updated[memberIndex],
                  weight: numValue,
                };

                checkTotal(updated); // set form errors if split totals exceed limits

                setDisplayValue(value);

                // allow input of negative numbers, but do not update split calculations
                // this allows users to input something like -10 + 20 and still get an expected result
                if (numValue < 0) {
                  return;
                }

                field.onChange(numValue);
              }}
              onBlur={() => {
                let completedValue = 0;

                // attempt to calculate in line expression
                try {
                  const evaluatedResult = parser.evaluate(displayValue);
                  // round to 2 decimal places
                  completedValue = Math.round(evaluatedResult * 100) / 100;
                } catch {
                  completedValue = parseFloat(displayValue) || 0;
                }

                // check for negative values
                if (completedValue < 0) {
                  completedValue = 0;
                }

                field.onChange(completedValue);
                setDisplayValue(
                  completedValue > 0 ? completedValue.toString() : "" // update display value
                );
              }}
              onFocus={() => {
                setDisplayValue(
                  field.value === 0 ? "" : field.value?.toString()
                );
              }}
              className="w-32 pr-8 !h-8 input-no-spinner"
              onWheel={(e) => e.currentTarget.blur()}
            />
            {/* Symbol for type of split in preview box */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
              {splitCostLabel}
            </span>
          </div>
          <FormMessage className="form-item-message" />
        </div>
      )}
    />
  );
};

export default MemberSplitRow;
