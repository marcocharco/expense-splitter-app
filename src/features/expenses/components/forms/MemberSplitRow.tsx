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

  // function calculateExpression() {
  //   let completedValue = 0;

  //   try {
  //     const rawResult = parser.evaluate(displayValue);
  //     // Round to 2 decimal places to fix floating-point precision issues
  //     completedValue = Math.round(rawResult * 100) / 100;
  //   } catch {
  //     completedValue = parseFloat(displayValue) || 0;
  //   }

  //   return completedValue;
  // }

  return (
    <FormField
      control={control}
      name={`memberSplits.${memberIndex}.weight`}
      render={({ field }) => (
        <>
          <span>{formatCurrency(isSelected ? splitAmount || 0 : 0)}</span>
          <div className="relative">
            <Input
              placeholder={isSelected && splitType !== "even" ? "0" : "-"}
              type="text"
              inputMode="decimal"
              disabled={!isSelected || splitType === "even"}
              value={isSelected && splitType !== "even" ? displayValue : ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9. +*/()\-]/g, "");
                console.log(value);

                // Allow up to 2 decimal places
                if (value.includes(".")) {
                  const terms = value.split(/[ +*/\-]/g);
                  let badInputFlag = false;

                  for (const term of terms) {
                    // no more than one decimal per term in expression
                    if (term.replace(/[^.]/g, "").length > 1) {
                      badInputFlag = true;
                      break;
                    } else {
                      // no more than two decimal places per term
                      const [, decimal] = term.split(".");
                      if (decimal && decimal.length > 2) {
                        badInputFlag = true;
                        break;
                      }
                    }
                  }
                  if (badInputFlag) return;
                }

                // type cast to number
                const numValue = value === "" ? 0 : Number(value);

                const updated = [...memberSplits];
                updated[memberIndex] = {
                  ...updated[memberIndex],
                  weight: numValue,
                };

                checkTotal(updated);

                const maxValue =
                  splitType === "percentage"
                    ? 100
                    : splitType === "custom"
                    ? currentAmount
                    : splitType === "shares"
                    ? 99999
                    : Infinity;

                if (numValue > maxValue) {
                  if (splitType === "shares") return;
                  setError(`memberSplits.${memberIndex}.weight`, {
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
                setDisplayValue(value);
                // Update field
                field.onChange(parseFloat(value) || 0);
              }}
              onBlur={() => {
                let completedValue = 0;

                try {
                  const rawResult = parser.evaluate(displayValue);
                  // Round to 2 decimal places to fix floating-point precision issues
                  completedValue = Math.round(rawResult * 100) / 100;
                } catch {
                  completedValue = parseFloat(displayValue) || 0;
                }

                setDisplayValue(
                  completedValue > 0 ? completedValue.toString() : "" // update display value with currency format
                );

                field.onChange(completedValue);
                // // Remove non-digit characters except decimal point
                // value = value.replace(/[^\d.]/g, "");

                // // Remove leading zeros
                // value = value.replace(/^0+(?=\d)/, "");

                // // Remove trailing zeros after decimal
                // if (value.includes(".")) {
                //   value = value.replace(/\.?0+$/, "");
                // }

                // // Handle empty or just decimal point
                // if (value === "" || value === ".") {
                //   value = "";
                // }
              }}
              onFocus={() => {
                setDisplayValue(
                  field.value === 0 ? "" : field.value?.toString()
                );
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
  );
};

export default MemberSplitRow;
