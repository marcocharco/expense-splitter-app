import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Expense } from "@/features/expenses/types/expense";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/utils/formatDate";

function titleCaseWord(word: string) {
  if (!word) {
    return ""; // Handle empty or null input
  }
  // Get the first character and convert to uppercase
  const firstLetter = word.charAt(0).toUpperCase();
  // Get the rest of the string and convert to lowercase
  const restOfString = word.slice(1).toLowerCase();

  // Concatenate and return the result
  return firstLetter + restOfString;
}

const ExpenseDetailsSheet = ({
  expense,
  onOpenChange,
}: {
  expense: Expense | null;
  onOpenChange: (expense: Expense | null) => void;
}) => {
  // Check if expense has items field to determine if it's multi-item
  const isMultiItem = expense && expense.items && expense.items.length > 0;

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
                {expense.title}
              </SheetTitle>
              <SheetDescription>
                Expense details and split information
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-semibold">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paid By</span>
                  <span className="font-medium">{expense.paid_by.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date</span>
                  <span>{formatDisplayDate(expense.date)}</span>
                </div>
                {expense.category && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">
                      {expense.category.icon} {expense.category.name}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Split Type</span>
                  <span className="normal-case">
                    {titleCaseWord(expense.split_type)}
                  </span>
                </div>
              </div>

              {/* Multi-Item Display */}
              {isMultiItem && expense.items && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Items</h3>
                  {expense.items.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.title}</span>
                        <span className="font-semibold">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Split Type
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.split_type}
                        </Badge>
                      </div>
                      {/* Item splits */}
                      <div className="space-y-1 border-t pt-2">
                        {item.splits.map((split, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-muted-foreground">
                              {split.user.name}
                            </span>
                            <div className="flex gap-3 items-center">
                              {split.weight > 0 &&
                                item.split_type !== "even" && (
                                  <span className="text-xs text-muted-foreground">
                                    Weight: {split.weight}
                                  </span>
                                )}
                              <span className="font-medium">
                                {formatCurrency(split.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Splits Display */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Splits</h3>
                <div className="space-y-2">
                  {expense.splits.map((split, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <span>{split.user.name}</span>
                      <div className="flex gap-4 items-center">
                        {expense.split_type !== "even" && split.weight > 0 && (
                          <span className="text-sm text-muted-foreground">
                            Weight: {split.weight}
                          </span>
                        )}
                        <span className="font-medium">
                          {formatCurrency(split.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ExpenseDetailsSheet;
