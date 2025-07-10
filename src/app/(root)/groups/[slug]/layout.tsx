import { getGroupBySlug } from "@/features/groups/queries/getGroupBySlug";
import { CurrentGroupProvider } from "@/features/groups/context/CurrentGroupContext";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getGroupExpenses } from "@/features/expenses/queries/getGroupExpensesServer";
import { getUnsettledTransactions } from "@/features/groups/queries/getUnsettledTransactionsServer";

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);
  if (!group) return <div>Group not found</div>;

  const queryClient = new QueryClient();

  // prefetch group expenses and inputs for balance calculations
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["groupExpenses", group.id],
      queryFn: () => getGroupExpenses(group.id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["groupBalances", group.id],
      queryFn: () => getUnsettledTransactions(group.id),
    }),
  ]);

  return (
    <CurrentGroupProvider group={group}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </CurrentGroupProvider>
  );
}
