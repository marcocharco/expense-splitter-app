import { FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";
import { Member, SplitType } from "@/types";
import { Control, useController, UseFormReturn } from "react-hook-form";
import { z } from "zod";

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

type MemberSplitRowProps = {
  control: Control<z.infer<ReturnType<typeof ExpenseFormSchema>>>;
  member: Member;
  isSelected: boolean;
  splitType: SplitType;
  memberSplits: {
    userId: string;
    weight: number;
  }[];
  selectedMembers: string[];
  currentAmount: number;
  setError: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["setError"];
  clearErrors: UseFormReturn<
    z.infer<ReturnType<typeof ExpenseFormSchema>>
  >["clearErrors"];
};

const MemberSplitRow = ({
  control,
  member,
  isSelected,
  splitType,
  memberSplits,
  selectedMembers,
  currentAmount,
  setError,
  clearErrors,
}: MemberSplitRowProps) => {
  const memberIndexMap = Object.fromEntries(
    memberSplits.map((m, i) => [m.userId, i])
  );
  const memberIndex = memberIndexMap[member.id];

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
    },
    [selectedMembers, splitType, currentAmount, setError, clearErrors]
  );

  const { field } = useController({
    name: `memberSplits.${memberIndex}.weight`,
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
    clearErrors(["memberSplits", "selectedMembers"]);
    checkTotal(memberSplits);
  }, [splitType, checkTotal, memberSplits, clearErrors]);

  return (
    <FormField
      control={control}
      name={`memberSplits.${memberIndex}.weight`}
      render={({ field }) => (
        <div className="flex items-center space-x-4">
          {/* Split amount previews */}
          <span className="w-20 text-right text-sm text-muted-foreground">
            {formatCurrency(isSelected ? splitAmount || 0 : 0)}
          </span>
          {/* Split inputs */}
          <div className="relative">
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
              className="w-32 pr-8 input-no-spinner"
              onWheel={(e) => e.currentTarget.blur()}
            />
            {/* Symbol for type of split in preview box */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
              {splitCostLabel}
            </span>
          </div>
          <FormMessage className="form-message" />
        </div>
      )}
    />
  );
};

export default MemberSplitRow;
