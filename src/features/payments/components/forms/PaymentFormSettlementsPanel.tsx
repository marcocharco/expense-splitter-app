import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormLabel } from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { Settlement } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

type PaymentFormSettlementsPanelProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  settlements: Settlement[];
  paidBy: string;
  paidTo: string;
  hasBothFields: boolean;
};

function PaymentFormSettlementsPanel<T extends FieldValues>({
  control,
  name,
  settlements,
  paidBy,
  paidTo,
  hasBothFields,
}: PaymentFormSettlementsPanelProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedSettlementIds: string[] = (field.value as string[]) || [];
        const selectedSet = new Set(selectedSettlementIds);

        const isAllSelected =
          settlements.length > 0 &&
          selectedSettlementIds.length === settlements.length;
        const selectAllState =
          selectedSettlementIds.length === 0
            ? false
            : isAllSelected
            ? true
            : "indeterminate";

        const toggleSettlement = (settlementId: string) => {
          const next = new Set<string>(selectedSet);
          if (next.has(settlementId)) {
            next.delete(settlementId);
          } else {
            next.add(settlementId);
          }
          field.onChange(Array.from(next));
        };

        if (hasBothFields && settlements.length === 0) {
          return (
            <div className="rounded-xl border border-dashed bg-muted/40 px-4 py-8 text-center">
              <p className="text-sm font-medium">No open settlements</p>
              <p className="text-xs text-muted-foreground">
                Start a settlement or select a different member to see open
                balances.
              </p>
            </div>
          );
        }

        return (
          <div className="flex flex-col h-full space-y-4">
            <FormLabel className="form-item-label">
              Choose Settlements
              <span className="text-muted-foreground font-normal text-sm">
                {" "}
                (select one or more)
              </span>
            </FormLabel>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectAllState}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") {
                    field.onChange(
                      checked
                        ? settlements.map((settlement) => settlement.id)
                        : []
                    );
                  } else {
                    field.onChange(
                      settlements.map((settlement) => settlement.id)
                    );
                  }
                }}
              />
              <span className="text-xs font-medium">
                {isAllSelected ? "Deselect All" : "Select All"}
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2">
              {settlements.map((settlement) => {
                const paidByParticipant = settlement.participants.find(
                  (participant) => participant.user.id === paidBy
                );
                const paidToParticipant = settlement.participants.find(
                  (participant) => participant.user.id === paidTo
                );
                const amountOwed = Math.max(
                  paidByParticipant?.remaining_balance ?? 0,
                  0
                );
                const isSelected = selectedSet.has(settlement.id);

                return (
                  <label
                    key={settlement.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-3 text-sm"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSettlement(settlement.id)}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{settlement.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {paidToParticipant
                          ? `${paidToParticipant.user.name} is owed `
                          : "Shared settlement"}
                        {formatCurrency(amountOwed)}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}

export default PaymentFormSettlementsPanel;
