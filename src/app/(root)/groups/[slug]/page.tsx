import GroupTabs from "@/features/groups/components/GroupTabs";
import { getGroupBySlug } from "@/features/groups/queries/getGroupBySlug";
import GroupActionButtons from "@/features/groups/components/GroupActionButtons";
import UserBalancePreview from "@/features/groups/components/UserBalancePreview";

const GroupPage = async ({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) => {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);

  return (
    <section className="layout-container">
      <div className="layout-content">
        <div className="flex flex-row items-center">
          <h1>{group?.name}</h1>
        </div>
        <div className="flex flex-row justify-between items-end flex-wrap gap-2">
          <UserBalancePreview />
          <GroupActionButtons />
        </div>

        <GroupTabs />
      </div>
    </section>
  );
};

export default GroupPage;
