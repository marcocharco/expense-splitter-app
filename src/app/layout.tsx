import type { Metadata } from "next";
import "@/assets/fonts/satoshi.css";
import "./globals.css";
import { UserProvider } from "@/features/users/context/UserContext";
import { getUserProfileServer } from "@/features/users/queries/getUserProfileServer";
import ReactQueryProvider from "@/app/ReactQueryProvider";

export const metadata: Metadata = {
  title: "SplitTheX",
  description: "",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserProfileServer();

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <UserProvider initialUser={user}>{children}</UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
