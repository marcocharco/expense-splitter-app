"use client";

import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useSettlements } from "@/features/settlements/hooks/useSettlements";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { SettlementCard } from "./SettlementCard";

const SettlementList = () => {
  const group = useCurrentGroup();
  const { settlements, isLoading } = useSettlements(group.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-40 w-full animate-pulse rounded-xl bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (!settlements || settlements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No settlements yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs mt-1">
          When you settle up balances in this group, they will appear here as
          organized history.
        </p>
      </div>
    );
  }

  const activeSettlements = settlements.filter((s) => s.status === "open");
  const pastSettlements = settlements.filter((s) => s.status === "closed");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Active Settlements */}
      {activeSettlements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Active Settlements
            </h2>
            <Badge
              variant="outline"
              className="bg-main/5 text-main border-main/20"
            >
              {activeSettlements.length} In Progress
            </Badge>
          </div>
          <div className="grid gap-4">
            {activeSettlements.map((settlement) => (
              <SettlementCard key={settlement.id} settlement={settlement} />
            ))}
          </div>
        </div>
      )}

      {/* Past Settlements */}
      {pastSettlements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">History</h2>
          <div className="grid gap-3">
            {pastSettlements.map((settlement) => (
              <SettlementCard
                key={settlement.id}
                settlement={settlement}
                compact
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettlementList;
