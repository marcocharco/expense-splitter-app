import Sidebar from "@/components/Sidebar";
import { UserGroupsProvider } from "@/context/UserGroupsContext";
import { getUserGroups } from "@/lib/queries/getUserGroups";

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
    </UserGroupsProvider>
  );
}
