"use client";

import FormDialog from "@/components/ui/FormDialog";
import ExpenseForm from "@/features/expenses/components/forms/ExpenseForm";
import NewPaymentSheet from "@/features/payments/components/NewPaymentSheet";
import NewSettlementSheet from "@/features/settlements/components/NewSettlementSheet";

const GroupActionButtons = () => {
  return (
    <div className="flex flex-wrap gap-3 justify-end">
      <FormDialog
        triggerText="Add expense"
        title="Add expense"
        description="Add a new expense to split amongst group members."
      >
        {(closeDialog) => (
          <ExpenseForm type="newExpense" onSuccess={closeDialog} />
        )}
      </FormDialog>
      <NewPaymentSheet />
      <NewSettlementSheet />
    </div>
  );
};

export default GroupActionButtons;
