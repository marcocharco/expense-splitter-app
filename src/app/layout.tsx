import type { Metadata } from "next";
import "@/assets/fonts/satoshi.css";
import "./globals.css";
import { getUserProfileServer } from "@/features/users/queries/getUserProfileServer";
import ReactQueryProvider from "@/app/ReactQueryProvider";
import { getQueryClient } from "@/app/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "SplitTheX",
  description: "",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  const user = await getUserProfileServer();

  // Prefetch user profile
  await queryClient.prefetchQuery({
    queryKey: ["userProfile"],
    queryFn: async () => user,
  });

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
