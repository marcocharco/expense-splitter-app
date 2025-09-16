import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Expense } from "@/types";

const ExpenseDetailsSheet = ({
  expense,
  onOpenChange,
}: {
  expense: Expense | null;
  onOpenChange: (expense: Expense | null) => void;
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
              <SheetTitle className="text-4xl font-medium">Details</SheetTitle>
              <SheetDescription>
                View details for {expense?.title}.
              </SheetDescription>
            </SheetHeader>
            <p>{expense.title}</p>
            <p>{expense.amount}</p>
            <p>{expense.date}</p>
            <p>Paid By: {expense.paid_by.name}</p>
            {/* Add details such as payments, date created, settled date, etc. */}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ExpenseDetailsSheet;
