import { SplitType } from "@/types";

export type splitInput = {
  type: SplitType;
  total_amount: number;
  member_splits: {
    user_id: string;
    percentage?: number;
    shares?: number;
    custom_amount?: number;
  }[];
};

export function calculateSplitCosts({
  type,
  total_amount,
  member_splits,
}: splitInput) {
  switch (type) {
    case "Even":
      const split_cost = total_amount / member_splits.length;
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: split_cost,
      }));
    case "Percentage":
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: ((member.percentage ?? 0) * total_amount) / 100,
      }));
    case "Shares":
      const totalShares = member_splits.reduce(
        (acc, member) => acc + (member.shares ?? 1),
        0
      );
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: ((member.shares ?? 1) / totalShares) * total_amount,
      }));
    case "Custom":
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: member.custom_amount,
      }));
    default:
      throw new Error("Unsupported split type");
  }
}
