"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingInvitations } from "@/features/groups/queries/getPendingInvitations";
import { acceptGroupInvitation } from "@/features/groups/server/group.actions";
import { toast } from "sonner";
import GroupCard from "@/features/groups/components/GroupCard";
// import { useRouter } from "next/navigation";

const PendingInvitations = () => {
  const queryClient = useQueryClient();
  // const router = useRouter();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ["pendingInvitations"],
    queryFn: getPendingInvitations,
  });

  const acceptInvitation = useMutation({
    mutationFn: async (token: string) => {
      const result = await acceptGroupInvitation(token);
      return result;
    },
    onSuccess: async () => {
      // onSuccess: async (data) => {
      toast.success("Invitation accepted!");

      // // Navigate to group page
      // if (data?.groupSlug) {
      //   router.push(`/groups/${data.groupSlug}`);
      // }

      // Invalidate user groups and invitations queries
      queryClient.invalidateQueries({ queryKey: ["pendingInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["userGroups"] });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept invitation"
      );
    },
  });

  if (isLoading) {
    return null;
  }

  if (!invitations || invitations.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-3 mb-4">
      <h2 className="text-xl font-medium">Pending Invitations</h2>
      {invitations.map((invitation) => (
        <GroupCard
          key={invitation.id}
          type="invitation"
          invitation={invitation}
          onAccept={(token) => acceptInvitation.mutate(token)}
          isAccepting={acceptInvitation.isPending}
        />
      ))}
    </div>
  );
};

export default PendingInvitations;
