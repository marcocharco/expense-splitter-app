"use client";

import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Settlement } from "../types/settlement";
import { useUser } from "@/features/users/hooks/useUser";
import { cn } from "@/lib/utils";

interface SettlementCardProps {
  settlement: Settlement;
  compact?: boolean;
}

export const SettlementCard = ({
  settlement,
  compact = false,
}: SettlementCardProps) => {
  const { user } = useUser();
  const debtors = settlement.participants.filter((p) => p.initial_balance < 0);
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

  const settledCount = settlement.participants.filter(
    (p) => p.remaining_balance === 0
  ).length;
  const totalCount = settlement.participants.length;

  const userParticipant = settlement.participants.find(
    (p) => p.user.id === user?.id
  );
  const userBalance = userParticipant?.remaining_balance ?? 0;
  const isOwed = userBalance < 0;
  const isOwer = userBalance > 0;
  const isSettled = userBalance === 0;

  if (compact) {
    return (
      <div className="group flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{settlement.title}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3" />
              {format(new Date(settlement.created_at), "MMM d, yyyy")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              $
              {totalInitialDebt.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
            <Badge
              variant="secondary"
              className="text-[10px] h-4 px-1.5 uppercase font-bold bg-muted text-muted-foreground border-none"
            >
              Closed
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md border-l-4 border-l-main">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold leading-none">
                {settlement.title}
              </h3>
              <Badge className="bg-main text-white border-none text-[10px] h-4 px-1.5 uppercase font-bold">
                Open
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Started by{" "}
              <span className="font-medium text-foreground">
                {settlement.created_by.name}
              </span>{" "}
              on {format(new Date(settlement.created_at), "MMM d")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-main">
              $
              {totalRemainingDebt.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Remaining to settle
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-main" />
              Settlement Progress
            </span>
            <span className="font-bold text-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
            <div
              className="h-full bg-main transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">
                Participants
              </p>
              <p className="text-sm font-bold">
                {settledCount}/{totalCount} Settled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border">
              {isOwer ? (
                <ArrowUpRight className="h-4 w-4 text-orange-500" />
              ) : isOwed ? (
                <ArrowDownLeft className="h-4 w-4 text-main" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground leading-none">
                {isOwer ? "You owe" : isOwed ? "You're owed" : "Status"}
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  isOwer && "text-orange-500",
                  isOwed && "text-main",
                  isSettled && "text-muted-foreground"
                )}
              >
                {isSettled
                  ? "Settled up"
                  : `$${Math.abs(userBalance).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
