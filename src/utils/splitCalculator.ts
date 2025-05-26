import { SplitType } from "@/types";

export type splitInput = {
  type: SplitType;
  total_amount: number;
  member_splits: {
    user_id: string;
    split: number;
  }[];
};

export function calculateSplitCosts({
  type,
  total_amount,
  member_splits,
}: splitInput) {
  switch (type) {
    case "even":
      const split_cost = total_amount / member_splits.length;
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: split_cost,
      }));
    case "percentage":
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: ((member.split ?? 0) * total_amount) / 100,
      }));
    case "shares":
      const totalShares = member_splits.reduce(
        (acc, member) => acc + (member.split ?? 1),
        0
      );
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: ((member.split ?? 1) / totalShares) * total_amount,
      }));
    case "custom":
      return member_splits.map((member) => ({
        user_id: member.user_id,
        amount: member.split,
      }));
    default:
      throw new Error("Unsupported split type");
  }
}
