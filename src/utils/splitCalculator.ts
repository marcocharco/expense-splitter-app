import { SplitType } from "@/types";

export type splitInput = {
  type: SplitType;
  totalAmount: number;
  memberSplits: {
    userId: string;
    split: number;
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
        amount: ((member.split ?? 0) * totalAmount) / 100,
      }));
    case "shares":
      const totalShares = memberSplits.reduce(
        (acc, member) => acc + Number(member.split),
        0
      );

      return memberSplits.map((member) => ({
        userId: member.userId,
        amount: (member.split / totalShares) * totalAmount,
      }));
    case "custom":
      return memberSplits.map((member) => ({
        userId: member.userId,
        amount: member.split,
      }));
    default:
      throw new Error("Unsupported split type");
  }
}
