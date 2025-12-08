import { Group, GroupInvitation } from "@/features/groups/types/group";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type GroupCardProps =
  | {
      type: "group";
      group: Group;
    }
  | {
      type: "invitation";
      invitation: GroupInvitation;
      onAccept?: (token: string) => void;
      onReject?: (token: string) => void;
      isAccepting?: boolean;
    };

const GroupCard = (props: GroupCardProps) => {
  if (props.type === "group") {
    const { group } = props;
    return (
      <Link
        href={`/groups/${group.slug}`}
        className="hover:bg-gray-100 rounded-xl"
      >
        <div className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow-chart sm:gap-6 sm:p-6">
          <p>{group.name}</p>
          <p className="text-sm text-neutral-500 ml-auto">
            {group.members.length} members
          </p>
        </div>
      </Link>
    );
  }

  // Invitation card
  const { invitation, onAccept, onReject, isAccepting } = props;
  return (
    <div
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-4 shadow-chart sm:gap-6 sm:p-6",
        "bg-white"
      )}
    >
      <div className="flex-1">
        <p className="font-medium">{invitation.group_name}</p>
        <p className="text-sm text-neutral-500">
          Invited by {invitation.invited_by_name}
        </p>
      </div>
      <div className="flex gap-2">
        {onReject && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(invitation.token)}
            disabled={isAccepting}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        )}
        {onAccept && (
          <Button
            size="sm"
            onClick={() => onAccept(invitation.token)}
            disabled={isAccepting}
            className="form-btn"
          >
            <Check className="h-4 w-4 mr-1" />
            Accept
          </Button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
