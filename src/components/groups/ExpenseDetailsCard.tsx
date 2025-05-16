import { Expense } from "@/types";

type ExpenseDetailsCardProps = {
  expense: Expense | null;
};

const ExpenseDetailsCard = ({ expense }: ExpenseDetailsCardProps) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <div className="expense-details-content">
      <h2 className="text-lg">{expense?.title}</h2>
      <p>
        Total Amount: {expense ? formattedAmount.format(expense?.amount) : ""}
      </p>
      <p>Paid By: {expense?.paid_by.name}</p>
      <p>This expense was split {expense?.split_type}</p>
      {expense?.splits.map((split) => {
        return (
          <p key={split.user.id}>
            {split.user.name}&apos;s Share:{" "}
            {formattedAmount.format(split.amount)}
          </p>
        );
      })}
      <p>Summary</p>
      {expense?.splits.map((split) => {
        if (split.user.id !== expense?.paid_by.id) {
          return (
            <p key={split.user.id}>
              {split.user.name} owes {expense.paid_by.name}{" "}
              {formattedAmount.format(split.amount)}
            </p>
          );
        }
      })}
    </div>
  );
};

export default ExpenseDetailsCard;
