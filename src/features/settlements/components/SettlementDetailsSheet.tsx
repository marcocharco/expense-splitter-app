"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Settlement } from "../types/settlement";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface SettlementDetailsSheetProps {
  settlement: Settlement | null;
  onOpenChange: (settlement: Settlement | null) => void;
}

export function SettlementDetailsSheet({
  settlement,
  onOpenChange,
}: SettlementDetailsSheetProps) {
  const debtors =
    settlement?.participants.filter((p) => p.initial_balance > 0) || [];
  const totalInitialDebt = debtors.reduce(
    (acc, p) => acc + Math.abs(p.initial_balance),
    0
  );
  const totalRemainingDebt = debtors.reduce(
    (acc, p) => acc + Math.abs(p.remaining_balance),
    0
  );
  const progress =
    totalInitialDebt > 0
      ? ((totalInitialDebt - totalRemainingDebt) / totalInitialDebt) * 100
      : 100;

  const settledCount =
    settlement?.participants.filter((p) => p.remaining_balance === 0).length ||
    0;
  const totalCount = settlement?.participants.length || 0;

  return (
    <Sheet
      open={Boolean(settlement)}
      onOpenChange={(isOpen) => !isOpen && onOpenChange(null)}
    >
      <SheetContent className="max-w-[50vw]! w-[50vw] px-16 py-16 max-h-screen overflow-y-scroll">
        {settlement && (
          <>
            <SheetHeader className="p-0!">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-main text-white border-none text-xs px-2 py-0.5 uppercase font-bold">
                  {settlement.status}
                </Badge>
              </div>
              <SheetTitle className="text-4xl font-medium">
                {settlement.title}
              </SheetTitle>
              <SheetDescription>
                Settlement started by {settlement.created_by.name} on{" "}
                {format(new Date(settlement.created_at), "MMM d, yyyy")}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-8">
              {/* Progress Summary */}
              <div className="bg-muted/30 rounded-2xl p-6 border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <TrendingUp className="h-4 w-4 text-main" />
                    <span>Overall Progress</span>
                  </div>
                  <span className="text-xl font-bold">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-main transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <div className="space-y-1">
                    <p className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                      Initial Debt
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(totalInitialDebt)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                      Remaining
                    </p>
                    <p className="text-lg font-semibold text-main">
                      {formatCurrency(totalRemainingDebt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants
                  <Badge variant="outline" className="ml-2 font-normal">
                    {settledCount}/{totalCount} Settled
                  </Badge>
                </h3>

                <div className="grid gap-3">
                  {settlement.participants.map((participant, idx) => {
                    const isSettled = participant.remaining_balance === 0;
                    const balance = participant.initial_balance;

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 rounded-xl border bg-card hover:bg-muted/20 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium flex items-center gap-2">
                            {participant.user.name}
                            {isSettled && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-4 px-1 bg-green-500/10 text-green-600 border-none"
                              >
                                Settled
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Initial:{" "}
                            {formatCurrency(
                              Math.abs(participant.initial_balance)
                            )}{" "}
                            {participant.initial_balance > 0 ? "owing" : "owed"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              isSettled
                                ? "text-muted-foreground"
                                : participant.remaining_balance > 0
                                ? "text-orange-500"
                                : "text-main"
                            }`}
                          >
                            {isSettled
                              ? "Settled"
                              : formatCurrency(
                                  Math.abs(participant.remaining_balance)
                                )}
                          </p>
                          {!isSettled && (
                            <p className="text-[10px] text-muted-foreground uppercase font-medium">
                              {participant.remaining_balance > 0
                                ? "Remaining to pay"
                                : "Remaining to receive"}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
