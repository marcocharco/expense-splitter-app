import { getGroupBySlug } from "@/lib/queries/getGroupBySlug";
import { CurrentGroupProvider } from "@/context/CurrentGroupContext";

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
  return <CurrentGroupProvider group={group}>{children}</CurrentGroupProvider>;
}
