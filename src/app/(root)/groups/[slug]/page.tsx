import GroupTabs from "@/components/groups/GroupTabs";

import { getGroupBySlug } from "@/lib/queries/getGroupBySlug";
import NewExpenseSheet from "@/components/forms/newExpense/NewExpenseSheet";
import NewPaymentSheet from "@/components/forms/payment/NewPaymentSheet";
import NewSettlementSheet from "@/components/forms/settlement/NewSettlementSheet";

const GroupPage = async ({
  params,
}: Readonly<{
  params: { slug: string };
}>) => {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);

  return (
    <section className="layout-container">
      <div className="layout-content">
        <div className="flex flex-row justify-between flex-wrap gap-y-2">
          <div className="flex flex-row items-center">
            {/* <Link href="/">
              <Button variant="link" size="icon">
                <ChevronLeft />
              </Button>
            </Link> */}

            <h1>{group?.name}</h1>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <NewExpenseSheet />
            <NewPaymentSheet />
            <NewSettlementSheet />
          </div>
        </div>

        <GroupTabs />
      </div>
    </section>
  );
};

export default GroupPage;
