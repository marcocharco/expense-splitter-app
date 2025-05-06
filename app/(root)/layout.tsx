import Sidebar from "@/components/Sidebar";

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = {firstName: "Bob", lastName: "Lee "};
  return (
    <main className="flex h-screen w-full font-display">
        <Sidebar user={loggedIn}/>
        {children}
    </main>
  );
}
