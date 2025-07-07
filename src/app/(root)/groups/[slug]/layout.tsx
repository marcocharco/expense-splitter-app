import { getGroupBySlug } from "@/features/groups/queries/getGroupBySlug";
import { CurrentGroupProvider } from "@/features/groups/context/CurrentGroupContext";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getGroupExpenses } from "@/features/expenses/queries/getGroupExpensesServer";

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

  await queryClient.prefetchQuery({
    queryKey: ["groupExpenses", group.id],
    queryFn: () => getGroupExpenses(group.id),
  });

  return (
    <CurrentGroupProvider group={group}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </CurrentGroupProvider>
  );
}
