export function calculateTotalShares(
  memberSplits: {
    userId: string;
    weight: number;
  }[],
  selectedMembers?: string[]
) {
  if (selectedMembers) {
    memberSplits = memberSplits.filter((m) =>
      selectedMembers.includes(m.userId)
    );
  }
  return memberSplits.reduce((acc, member) => acc + Number(member.weight), 0);
}
