import MultiSelectInput from "@/components/forms/MultiSelectInput";
import { FormLabel } from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

type SelectableExpense = {
  id: string;
  label: string;
};

type PaymentFormExpensesPanelProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  items: SelectableExpense[];
  hasBothFields: boolean;
};

function PaymentFormExpensesPanel<T extends FieldValues>({
  control,
  name,
  items,
  hasBothFields,
}: PaymentFormExpensesPanelProps<T>) {
  if (hasBothFields && items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/40 px-4 py-8 text-center">
        <p className="text-sm font-medium">No unpaid expenses</p>
        <p className="text-xs text-muted-foreground">
          Select a different member or add new expenses to settle.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormLabel className="form-item-label">
        Choose Expenses
        <span className="text-muted-foreground font-normal text-sm">
          {" "}
          (select one or more)
        </span>
      </FormLabel>
      <MultiSelectInput control={control} name={name} items={items} />
    </div>
  );
}

export default PaymentFormExpensesPanel;
