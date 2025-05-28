import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Scale } from "lucide-react";
import GroupTabs from "@/components/groups/GroupTabs";

import { getGroupBySlug } from "@/lib/queries/getGroupBySlug";
import NewExpenseSheet from "@/components/forms/newExpense/NewExpenseSheet";

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
            <Link href="">
              <Button variant="outline">
                <Scale />
                Settle expenses
              </Button>
            </Link>
          </div>
        </div>

        <GroupTabs />
      </div>
    </section>
  );
};

export default GroupPage;
