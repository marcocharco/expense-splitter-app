"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/features/expenses/components/TableColumns";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import GroupBalances from "@/features/groups/components/GroupBalances";
import PaymentList from "@/features/payments/components/PaymentList";
import SettlementList from "@/features/settlements/components/SettlementList";
import { useCurrentGroup } from "../context/CurrentGroupContext";

const GroupTabs = () => {
  const group = useCurrentGroup();
  const { expenses } = useExpenses(group?.id ?? "");
  return (
    <Tabs defaultValue="expenses" className="w-full !gap-4">
      <TabsList className="flex gap-4">
        <TabsTrigger value="activity" className="px-2">
          Activity
        </TabsTrigger>
        <TabsTrigger value="expenses" className="px-2">
          Expenses
        </TabsTrigger>
        <TabsTrigger value="payments" className="px-2">
          Payments
        </TabsTrigger>
        <TabsTrigger value="settlements" className="px-2">
          Settlements
        </TabsTrigger>
        <TabsTrigger value="members" className="px-2">
          Members
        </TabsTrigger>
      </TabsList>
      <TabsContent value="activity" className="justify-center">
        <p>Activity Logs</p>
      </TabsContent>
      <TabsContent value="expenses">
        <DataTable columns={columns} data={expenses} />
      </TabsContent>
      <TabsContent value="payments">
        <PaymentList />
      </TabsContent>
      <TabsContent value="settlements">
        <SettlementList />
      </TabsContent>
      <TabsContent value="members">
        <GroupBalances />
      </TabsContent>
    </Tabs>
  );
};

export default GroupTabs;
