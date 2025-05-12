import Sidebar from "@/components/Sidebar";
import { UserGroupsProvider } from "@/context/UserGroupsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserGroupsProvider>
      <main className="flex h-screen w-full font-display">
        <Sidebar />
        {children}
      </main>
    </UserGroupsProvider>
  );
}
