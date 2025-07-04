import type { Metadata } from "next";
import { DM_Sans, Raleway, Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/features/users/context/UserContext";
import { getUserProfileServer } from "@/features/users/queries/getUserProfileServer";
import ReactQueryProvider from "@/components/ReactQueryProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "uomi",
  description: "",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserProfileServer();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${raleway.variable} ${inter.variable}`}
    >
      <body>
        <ReactQueryProvider>
          <UserProvider initialUser={user}>{children}</UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
