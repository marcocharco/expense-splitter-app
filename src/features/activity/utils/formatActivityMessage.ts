import {
  Activity,
  ActivityMeta,
  PaymentCreateMeta,
} from "@/features/activity/types/activity";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";

export function formatActivityMessage(activity: Activity): string {
  const actorName = activity.actor?.name || "Someone";
  const meta = activity.meta as ActivityMeta;

  switch (activity.activity_type) {
    case "create_expense":
      if ("expense" in meta && "amount" in meta.expense) {
        return `${actorName} added expense "${meta.expense.title}" for ${formatCurrency(Number(meta.expense.amount))}`;
      }
      break;

    case "update_expense":
      if ("changes" in meta && "expense" in meta) {
        const changeDescriptions = meta.changes.map((change) => {
          const fieldName = change.field.replace(/_/g, " ");
          const before = formatValue(change.field, change.before);
          const after = formatValue(change.field, change.after);
          return `${fieldName} from ${before} to ${after}`;
        });
        return `${actorName} updated expense "${meta.expense.title}": ${changeDescriptions.join(", ")}`;
      }
      break;

    case "delete_expense":
      if ("expense" in meta) {
        return `${actorName} deleted expense "${meta.expense.title}"`;
      }
      break;

    case "pay_expense":
      if ("payment" in meta && "expense" in meta && "amount" in meta.payment) {
        return `${actorName} paid ${formatCurrency(Number(meta.payment.amount))} toward expense "${meta.expense.title}"`;
      }
      break;

    case "create_payment":
      if (
        "payment" in meta &&
        "amount" in meta.payment &&
        meta.action === "created"
      ) {
        const paymentMeta = meta as PaymentCreateMeta;
        const targetDescriptions = paymentMeta.targets
          ?.map((t) => `${formatCurrency(t.amount)} to ${t.title || t.type}`)
          .join(", ");
        return `${actorName} created payment of ${formatCurrency(
          Number(paymentMeta.payment.amount)
        )}${targetDescriptions ? ` (${targetDescriptions})` : ""}`;
      }
      break;

    case "create_settlement":
      if ("settlement" in meta) {
        return `${actorName} started settlement "${meta.settlement.title}" with ${meta.settlement.expense_count} expense${meta.settlement.expense_count !== 1 ? "s" : ""}`;
      }
      break;
  }

  return `${actorName} performed ${activity.activity_type}`;
}

function formatValue(field: string, value: unknown): string {
  if (value === null || value === undefined) {
    return "nothing";
  }

  if (field.includes("amount") || field === "amount") {
    return formatCurrency(Number(value));
  }

  if (field.includes("date") || field === "date") {
    if (typeof value === "string") {
      return formatDisplayDate(value) || value;
    }
    return String(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

