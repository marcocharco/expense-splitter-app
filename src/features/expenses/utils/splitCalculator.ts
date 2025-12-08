import { SplitType } from "@/features/expenses/types/expense";
import { calculateTotalShares } from "@/features/expenses/utils/totalSharesCalculator";

export type splitInput = {
  type: SplitType;
  totalAmount: number;
  memberSplits: {
    userId: string;
    weight: number;
  }[];
  selectedMembers?: string[];
};

export function calculateSplitCosts({
  type,
  totalAmount,
  memberSplits,
  selectedMembers,
}: splitInput) {
  if (selectedMembers) {
    memberSplits = memberSplits.filter((m) =>
      selectedMembers.includes(m.userId)
    );
  }

  switch (type) {
    case "even":
      const splitCost = totalAmount / memberSplits.length;
      return memberSplits.map((member) => ({
        userId: member.userId,
        amount: splitCost,
      }));
    case "percentage":
      return memberSplits.map((member) => ({
        userId: member.userId,
        amount: ((member.weight ?? 0) * totalAmount) / 100,
      }));
    case "shares":
      const totalShares = calculateTotalShares(memberSplits);

      return memberSplits.map((member) => ({
        userId: member.userId,
        amount: (member.weight / totalShares) * totalAmount,
      }));
    case "custom":
      return memberSplits.map((member) => ({
        userId: member.userId,
        amount: member.weight,
      }));
    default:
      throw new Error("Unsupported split type");
  }
}
