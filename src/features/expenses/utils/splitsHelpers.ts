// utils/splitsHelpers.ts
export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

export const getSelectedTotal = (
  memberSplits: { userId: string; weight: number }[],
  selectedIds: string[]
) =>
  sum(
    selectedIds.map(
      (id) => memberSplits.find((m) => m.userId === id)?.weight || 0
    )
  );

export const isOverTotalLimit = (
  total: number,
  splitType: "percentage" | "custom" | string,
  currentAmount: number
) =>
  splitType === "percentage"
    ? total > 100
    : splitType === "custom"
    ? total > currentAmount
    : false;

export const errorMsgForLimit = (
  splitType: "percentage" | "custom",
  currentAmount: number
) =>
  splitType === "percentage"
    ? "Total percentage cannot exceed 100%"
    : `Total splits cannot exceed amount ($${currentAmount})`;
