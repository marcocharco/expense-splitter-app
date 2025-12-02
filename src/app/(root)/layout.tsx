import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { getUserGroupsServer } from "@/features/groups/queries/getUserGroupsServer";
import { getQueryClient } from "@/app/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  const groups = await getUserGroupsServer();

  // Prefetch user groups
  await queryClient.prefetchQuery({
    queryKey: ["userGroups"],
    queryFn: async () => groups,
  });

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
