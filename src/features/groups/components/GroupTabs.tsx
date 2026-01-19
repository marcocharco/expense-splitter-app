"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseTable } from "@/features/expenses/components/table/ExpenseTable";
import { createExpenseTableColumns } from "@/features/expenses/components/table/ExpenseTableColumns";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import GroupBalances from "@/features/groups/components/GroupBalances";
// import PaymentList from "@/features/payments/components/PaymentList";
import SettlementList from "@/features/settlements/components/SettlementList";
import FormDialog from "@/components/ui/FormDialog";
import SingleItemExpenseForm from "@/features/expenses/components/forms/SingleItemExpenseForm";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/hooks/useUser";
import { Expense } from "@/features/expenses/types/expense";
import ExpenseDetailsSheet from "@/features/expenses/components/ExpenseDetailsSheet";
import MultiItemExpenseForm from "@/features/expenses/components/forms/MultiItemExpenseForm";
import { ActivityLog } from "@/features/activity/components/ActivityLog";
import { PaymentDetailsSheet } from "@/features/payments/components/PaymentDetailsSheet";
import { SettlementDetailsSheet } from "@/features/settlements/components/SettlementDetailsSheet";
import { Payment } from "@/features/payments/types/payment";
import { Settlement } from "@/features/settlements/types/settlement";
import { getExpense } from "@/features/expenses/queries/getExpense";
import { getPayment } from "@/features/payments/queries/getPayment";
import { getSettlement } from "@/features/settlements/queries/getSettlement";
import { EntityType } from "@/features/activity/types/activity";

const GroupTabs = () => {
  const group = useCurrentGroup();
  const { user } = useUser();
  const { expenses } = useExpenses(group?.id ?? "");
  const [expenseToUpdate, setExpenseToUpdate] = useState<Expense | null>(null);
  const [expenseToDuplicate, setExpenseToDuplicate] = useState<Expense | null>(
    null
  );
  const [expenseToView, setExpenseToView] = useState<Expense | null>(null);
  const [paymentToView, setPaymentToView] = useState<Payment | null>(null);
  const [settlementToView, setSettlementToView] = useState<Settlement | null>(
    null
  );
  const { deleteExpense } = useExpenses(group?.id ?? "");

  const handleActivityItemClick = async (type: EntityType, id: string) => {
    try {
      if (type === "expense") {
        const expense = await getExpense(id);
        setExpenseToView(expense);
      } else if (type === "payment") {
        const payment = await getPayment(id);
        setPaymentToView(payment);
      } else if (type === "settlement") {
        const settlement = await getSettlement(id);
        setSettlementToView(settlement);
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} details:`, error);
    }
  };

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
    (expense: Expense) => {
      setExpenseToView(expense); // for viewing details
    },
    user?.id
  );

  return (
    <>
      <Tabs defaultValue="activity" className="w-full !gap-4">
        <TabsList className="flex gap-4">
          <TabsTrigger value="activity" className="px-2">
            Activity
          </TabsTrigger>
          <TabsTrigger value="expenses" className="px-2">
            Expenses
          </TabsTrigger>
          {/* <TabsTrigger value="payments" className="px-2">
            Payments
          </TabsTrigger> */}
          <TabsTrigger value="settlements" className="px-2">
            Settlements
          </TabsTrigger>
          <TabsTrigger value="members" className="px-2">
            Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="justify-center">
          {group?.id ? (
            <ActivityLog
              groupId={group.id}
              onItemClick={handleActivityItemClick}
            />
          ) : null}
        </TabsContent>
        <TabsContent value="expenses">
          <ExpenseTable columns={columns} data={expenses} />
        </TabsContent>
        {/* <TabsContent value="payments">
          <PaymentList />
        </TabsContent> */}
        <TabsContent value="settlements">
          <SettlementList onSettlementClick={setSettlementToView} />
        </TabsContent>
        <TabsContent value="members">
          <GroupBalances />
        </TabsContent>
      </Tabs>

      {/* Edit Expense */}
      <FormDialog
        title="Update Expense"
        description={`Update ${expenseToUpdate?.title || "expense"}.`}
        open={Boolean(expenseToUpdate)}
        onOpenChange={(isOpen) => !isOpen && setExpenseToUpdate(null)}
        fullHeight={Boolean(expenseToUpdate?.items?.length)}
      >
        {(closeDialog) =>
          expenseToUpdate &&
          (expenseToUpdate.items && expenseToUpdate.items.length > 0 ? (
            <MultiItemExpenseForm
              type="updateExpense"
              initialExpense={expenseToUpdate}
              onSuccess={() => {
                closeDialog();
                setExpenseToUpdate(null);
              }}
            />
          ) : (
            <SingleItemExpenseForm
              type="updateExpense"
              initialExpense={expenseToUpdate}
              onSuccess={() => {
                closeDialog();
                setExpenseToUpdate(null);
              }}
            />
          ))
        }
      </FormDialog>

      {/* Duplicate Expense */}
      <FormDialog
        title="Duplicate Expense"
        description={`Create a copy of "${
          expenseToDuplicate?.title || "expense"
        }".`}
        open={Boolean(expenseToDuplicate)}
        onOpenChange={(isOpen) => !isOpen && setExpenseToDuplicate(null)}
        fullHeight={Boolean(expenseToDuplicate?.items?.length)}
      >
        {(closeDialog) =>
          expenseToDuplicate &&
          (expenseToDuplicate.items && expenseToDuplicate.items.length > 0 ? (
            <MultiItemExpenseForm
              type="newExpense"
              initialExpense={expenseToDuplicate}
              onSuccess={() => {
                closeDialog();
                setExpenseToUpdate(null);
              }}
            />
          ) : (
            <SingleItemExpenseForm
              type="newExpense"
              initialExpense={expenseToDuplicate}
              onSuccess={() => {
                closeDialog();
                setExpenseToUpdate(null);
              }}
            />
          ))
        }
      </FormDialog>

      <ExpenseDetailsSheet
        expense={expenseToView}
        onOpenChange={setExpenseToView}
      />

      <PaymentDetailsSheet
        payment={paymentToView}
        onOpenChange={setPaymentToView}
        onExpenseClick={(expenseId) =>
          handleActivityItemClick("expense", expenseId)
        }
      />

      <SettlementDetailsSheet
        settlement={settlementToView}
        onOpenChange={setSettlementToView}
      />
    </>
  );
};

export default GroupTabs;
