import { Expense } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

type ExpenseDetailsCardProps = {
  expense: Expense | null;
};

const ExpenseDetailsCard = ({ expense }: ExpenseDetailsCardProps) => {
  return (
    <div className="expense-details-content">
      <h2 className="text-lg">{expense?.title}</h2>
      <p>Total Amount: {expense && formatCurrency(expense?.amount)}</p>
      <p>Paid By: {expense?.paid_by.name}</p>
      <p>This expense was split {expense?.split_type}</p>
      {expense?.splits.map((split) => {
        return (
          <p key={split.user.id}>
            {split.user.name}&apos;s Share: {formatCurrency(split.amount)}
          </p>
        );
      })}
      <p>Summary</p>
      {expense?.splits.map((split) => {
        if (split.user.id !== expense?.paid_by.id) {
          return (
            <p key={split.user.id}>
              {split.user.name} owes {expense.paid_by.name}{" "}
              {formatCurrency(split.amount)}
            </p>
          );
        }
      })}
    </div>
  );
};

export default ExpenseDetailsCard;
