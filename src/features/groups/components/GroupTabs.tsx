import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseList from "@/features/expenses/components/ExpenseList";
import GroupBalances from "@/features/groups/components/GroupBalances";
import PaymentList from "@/features/payments/components/PaymentList";
import SettlementList from "@/features/settlements/components/SettlementList";

const GroupTabs = () => {
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
        <ExpenseList />
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
