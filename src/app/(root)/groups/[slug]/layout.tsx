import { getGroupBySlug } from "@/lib/queries/getGroupBySlug";
import { CurrentGroupProvider } from "@/context/CurrentGroupContext";
import { ExpensesProvider } from "@/context/ExpensesContext";
import { getGroupExpenses } from "@/lib/queries/getGroupExpenses";

export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);
  if (!group) return <div>Group not found</div>;

  const expenses = await getGroupExpenses(group?.id);
  return (
    <CurrentGroupProvider group={group}>
      <ExpensesProvider initialExpenses={expenses}>{children}</ExpensesProvider>
    </CurrentGroupProvider>
  );
}
