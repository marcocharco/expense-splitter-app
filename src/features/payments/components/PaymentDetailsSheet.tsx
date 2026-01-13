"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Payment } from "../types/payment";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/formatDate";
import { Badge } from "@/components/ui/badge";

interface PaymentDetailsSheetProps {
  payment: Payment | null;
  onOpenChange: (payment: Payment | null) => void;
}

export function PaymentDetailsSheet({
  payment,
  onOpenChange,
}: PaymentDetailsSheetProps) {
  return (
    <Sheet
      open={Boolean(payment)}
      onOpenChange={(isOpen) => !isOpen && onOpenChange(null)}
    >
      <SheetContent className="max-w-[50vw]! w-[50vw] px-16 py-16 max-h-screen overflow-y-scroll">
        {payment && (
          <>
            <SheetHeader className="p-0!">
              <SheetTitle className="text-4xl font-medium">
                Payment Details
              </SheetTitle>
              <SheetDescription>
                Summary of the transaction and allocated expenses
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    Amount
                  </p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    Date
                  </p>
                  <p className="text-xl font-medium">
                    {formatDisplayDate(payment.date)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-6 border-y">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    Paid By
                  </p>
                  <p className="text-lg font-medium">{payment.paid_by.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    Paid To
                  </p>
                  <p className="text-lg font-medium">{payment.paid_to.name}</p>
                </div>
              </div>

              {/* Allocations */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  Allocated Expenses
                  <Badge variant="outline" className="ml-2 font-normal">
                    {payment.expense_allocations?.length || 0}
                  </Badge>
                </h3>

                {payment.expense_allocations && payment.expense_allocations.length > 0 ? (
                  <div className="space-y-3">
                    {payment.expense_allocations.map((allocation, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{allocation.expense.title}</p>
                          <p className="text-xs text-muted-foreground">Expense ID: {allocation.expense.id.slice(0, 8)}...</p>
                        </div>
                        <p className="text-lg font-semibold">
                          {formatCurrency(allocation.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed">
                    {payment.settlement ? (
                      <div className="space-y-2">
                        <p className="font-medium text-muted-foreground">
                          This payment was part of a settlement:
                        </p>
                        <p className="text-lg font-semibold">{payment.settlement.title}</p>
                        <Badge>{payment.settlement.status}</Badge>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No specific expense allocations found for this payment.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
