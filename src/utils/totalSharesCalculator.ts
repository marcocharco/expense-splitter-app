export function calculateTotalShares(
  memberSplits: {
    userId: string;
    split: number;
  }[],
  selectedMembers?: string[]
) {
  if (selectedMembers) {
    memberSplits = memberSplits.filter((m) =>
      selectedMembers.includes(m.userId)
    );
  }
  return memberSplits.reduce((acc, member) => acc + Number(member.split), 0);
}
