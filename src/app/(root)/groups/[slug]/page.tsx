"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Plus, Scale } from "lucide-react";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import GroupTabs from "@/components/groups/GroupTabs";

import { ExpensesProvider } from "@/context/ExpensesContext";

const GroupPage = () => {
  const group = useCurrentGroup();

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
            <Link href={`/groups/${group?.slug}/add-expense`}>
              <Button variant="outline">
                <Plus /> Add expense
              </Button>
            </Link>
            <Link href="">
              <Button variant="outline">
                <Scale />
                Settle expenses
              </Button>
            </Link>
          </div>
        </div>
        <ExpensesProvider>
          <GroupTabs />
        </ExpensesProvider>
      </div>
    </section>
  );
};

export default GroupPage;
