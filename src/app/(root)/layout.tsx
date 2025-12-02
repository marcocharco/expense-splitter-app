import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUserGroupsServer } from "@/features/groups/queries/getUserGroupsServer";
import { getPendingInvitationsServer } from "@/features/groups/queries/getPendingInvitationsServer";
import { getQueryClient } from "@/app/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  
  // Prefetch user groups and pending invitations in parallel
  const [groups, invitations] = await Promise.all([
    getUserGroupsServer(),
    getPendingInvitationsServer(),
  ]);

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["userGroups"],
      queryFn: async () => groups,
    }),
    queryClient.prefetchQuery({
      queryKey: ["pendingInvitations"],
      queryFn: async () => invitations,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex h-screen w-full font-display">
        <Sidebar />
        {children}
      </main>
      <Toaster />
    </HydrationBoundary>
  );
}
