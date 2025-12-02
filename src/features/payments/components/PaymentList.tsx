"use client";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/hooks/useUser";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { formatCurrency } from "@/utils/formatCurrency";
import { Payment } from "@/types";
import { formatDisplayDate } from "@/utils/formatDate";

const PaymentList = () => {
  const group = useCurrentGroup();
  const { user } = useUser();

  const { payments } = usePayments(group.id);

  if (!user) {
    return null;
  }

  const formatPaymentText = (payment: Payment) => {
    const isCurrentUserPayer = payment.paid_by.id === user.id;
    const isCurrentUserRecipient = payment.paid_to.id === user.id;
    const amount = formatCurrency(payment.amount);
    const date = formatDisplayDate(payment.date);

    // Determine if this is a settlement payment or expense payment
    const isSettlementPayment = payment.settlement && payment.settlement.id;

    if (isCurrentUserPayer) {
      // Current user made the payment
      if (isSettlementPayment) {
        return `You paid ${payment.paid_to.name} ${amount} towards ${payment.settlement?.title} on ${date}`;
      } else {
        // Payment towards expenses
        const expenseCount = payment.expense_allocations?.length || 0;
        return `You paid ${
          payment.paid_to.name
        } ${amount} towards ${expenseCount} expense${
          expenseCount > 1 ? "s" : ""
        } on ${date}`;
      }
    } else if (isCurrentUserRecipient) {
      // Current user received the payment
      if (isSettlementPayment) {
        return `${payment.paid_by.name} paid you ${amount} towards ${payment.settlement?.title} on ${date}`;
      } else {
        // Payment towards expenses
        const expenseCount = payment.expense_allocations?.length || 0;
        return `${
          payment.paid_by.name
        } paid you ${amount} towards ${expenseCount} expense${
          expenseCount > 1 ? "s" : ""
        } on ${date}`;
      }
    } else {
      // Payment between other users
      if (isSettlementPayment) {
        return `${payment.paid_by.name} paid ${payment.paid_to.name} ${amount} towards ${payment.settlement?.title} on ${date}`;
      } else {
        // Payment towards expenses
        const expenseCount = payment.expense_allocations?.length || 0;
        return `${payment.paid_by.name} paid ${
          payment.paid_to.name
        } ${amount} towards ${expenseCount} expense${
          expenseCount > 1 ? "s" : ""
        } on ${date}`;
      }
    }
  };

  return (
    <>
      {payments?.map((payment) => {
        return (
          <div key={payment.id} className="p-4 border-b">
            {formatPaymentText(payment)}
          </div>
        );
      })}
    </>
  );
};

export default PaymentList;
