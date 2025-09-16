"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseTable } from "@/features/expenses/components/table/ExpenseTable";
import { createExpenseTableColumns } from "@/features/expenses/components/table/ExpenseTableColumns";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import GroupBalances from "@/features/groups/components/GroupBalances";
import PaymentList from "@/features/payments/components/PaymentList";
import SettlementList from "@/features/settlements/components/SettlementList";
import UpdateFormDialog from "@/components/ui/UpdateFormDialog";
import ExpenseForm from "@/features/expenses/components/forms/ExpenseForm";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/context/UserContext";
import { Expense } from "@/types";

const GroupTabs = () => {
  const group = useCurrentGroup();
  const { user } = useUser();
  const { expenses } = useExpenses(group?.id ?? "");
  const [expenseToUpdate, setExpenseToUpdate] = useState<Expense | null>(null);
  const [expenseToDuplicate, setExpenseToDuplicate] = useState<Expense | null>(
    null
  );
  const { deleteExpense } = useExpenses(group?.id ?? "");

  const columns = createExpenseTableColumns(
    (expense: Expense) => {
      setExpenseToUpdate(expense); // for editing
    },
    (expenseId: string) => {
      deleteExpense({ expenseId }); // for deleting
    },
    (expense: Expense) => {
      setExpenseToDuplicate(expense); // for duplicating
    },
    user?.id
  );

  return (
    <>
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
          <ExpenseTable columns={columns} data={expenses} />
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

      <UpdateFormDialog
        title="Update Expense"
        description={`Update ${expenseToUpdate?.title || "expense"}.`}
        open={Boolean(expenseToUpdate)}
        onOpenChange={(isOpen) => !isOpen && setExpenseToUpdate(null)}
      >
        {(closeDialog) =>
          expenseToUpdate && (
            <ExpenseForm
              type="updateExpense"
              initialExpense={expenseToUpdate}
              onSuccess={() => {
                closeDialog();
                setExpenseToUpdate(null);
              }}
            />
          )
        }
      </UpdateFormDialog>

      <UpdateFormDialog
        title="Duplicate Expense"
        description={`Create a copy of "${
          expenseToDuplicate?.title || "expense"
        }".`}
        open={Boolean(expenseToDuplicate)}
        onOpenChange={(isOpen) => !isOpen && setExpenseToDuplicate(null)}
      >
        {(closeDialog) =>
          expenseToDuplicate && (
            <ExpenseForm
              type="newExpense"
              initialExpense={expenseToDuplicate}
              onSuccess={() => {
                closeDialog();
                setExpenseToDuplicate(null);
              }}
            />
          )
        }
      </UpdateFormDialog>
    </>
  );
};

export default GroupTabs;
