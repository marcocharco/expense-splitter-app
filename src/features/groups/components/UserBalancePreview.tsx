"use client";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/hooks/useUser";
import { formatCurrency } from "@/utils/formatCurrency";
import { useGroupMemberBalances } from "@/features/groups/hooks/useGroupMemberBalances";

const UserBalancePreview = () => {
  const group = useCurrentGroup();
  const { user } = useUser();
  const memberBalances = useGroupMemberBalances(group?.id ?? "");

  if (!user || !group) return null;

  const userBalance = memberBalances.get(user.id);
  const netOwing = userBalance?.netOwing ?? 0;
  const absValue = Math.abs(netOwing);
  const isOwed = netOwing < 0;
  const isOwes = netOwing > 0;

  let displayText;

  // Don't show if balance is zero
  if (absValue === 0) {
    displayText = "$0.00";
  } else {
    displayText = isOwed
      ? `You are owed ${formatCurrency(absValue)}`
      : `You owe ${formatCurrency(absValue)}`;
  }

  return (
    <div className="grow">
      <h3 className="font-normal text-sm text-neutral-500">Your Balance</h3>
      <p
        className={`text-lg font-medium ${
          isOwed ? "text-main" : isOwes ? "text-orange-500" : ""
        }`}
      >
        {displayText}
      </p>
    </div>
  );
};

export default UserBalancePreview;
