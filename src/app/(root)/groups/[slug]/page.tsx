import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Scale } from "lucide-react";
import GroupTabs from "@/components/groups/GroupTabs";

import { ExpensesProvider } from "@/context/ExpensesContext";
import { getGroupBySlug } from "@/lib/queries/getGroupBySlug";
import { getGroupExpenses } from "@/lib/queries/getGroupExpenses";
import NewExpenseSheet from "@/components/forms/newExpense/NewExpenseSheet";

const GroupPage = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string };
}>) => {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);

  const expenses = await getGroupExpenses(group?.id);

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
        <ExpensesProvider initialExpenses={expenses}>
          <GroupTabs />
          {children}
        </ExpensesProvider>
      </div>
    </section>
  );
};

export default GroupPage;
