import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ExpenseForm from "./ExpenseForm";
import { Expense } from "@/types";

const UpdateExpenseSheet = ({
  expense,
  onOpenChange,
}: {
  expense: Expense | null;
  onOpenChange: (e: Expense | null) => void;
}) => {
  return (
    <Sheet
      open={Boolean(expense)}
      onOpenChange={(isOpen) => !isOpen && onOpenChange(null)}
    >
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent className="max-w-[50vw]! w-[50vw] px-16 py-16 max-h-screen overflow-y-scroll">
        {expense && (
          <>
            <SheetHeader className="p-0!">
              <SheetTitle className="text-4xl font-medium">
                Update Expense
              </SheetTitle>
              <SheetDescription>Update {expense?.title}.</SheetDescription>
            </SheetHeader>
            <ExpenseForm
              type="updateExpense"
              initialExpense={expense!}
              onSuccess={() => onOpenChange(null)}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UpdateExpenseSheet;
