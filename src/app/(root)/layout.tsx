import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { UserGroupsProvider } from "@/features/groups/contexts/UserGroupsContext";
import { getUserGroups } from "@/features/groups/queries/getUserGroups";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const groups = await getUserGroups();
  return (
    <UserGroupsProvider initialGroups={groups}>
      <main className="flex h-screen w-full font-display">
        <Sidebar />
        {children}
      </main>
      <Toaster />
    </UserGroupsProvider>
  );
}
