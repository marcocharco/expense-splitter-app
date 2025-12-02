"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./getQueryClient";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the same QueryClient instance that's used for server-side prefetching
  // This ensures hydration works correctly - getQueryClient() returns a singleton on the client
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
