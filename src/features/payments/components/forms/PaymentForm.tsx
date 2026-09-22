import { Button } from "@/components/ui/button";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/hooks/useUser";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { PaymentFormSchema } from "@/features/payments/schemas/paymentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import AmountInput from "@/components/forms/AmountInput";
import { Form } from "@/components/ui/form";
import MemberSelectInput from "@/components/forms/MemberSelectInput";
import DatePickerInput from "@/components/forms/DatePickerInput";
import NoteInput from "@/components/forms/NoteInput";
import PaymentTypeInput from "./PaymentTypeInput";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { ExpenseSplit } from "@/features/expenses/types/expense";
import { DateToYMD } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { useSettlements } from "@/features/settlements/hooks/useSettlements";
import { usePayableExpenses, usePayableExpenseItems, usePayableSettlements } from "@/features/payments/hooks/usePayableItems";
import { toast } from "sonner";
import MultiSelectInput from "@/components/forms/MultiSelectInput";
import { FormLabel } from "@/components/ui/form";
import PaymentFormSettlementsPanel from "./PaymentFormSettlementsPanel";

const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUser();
  const group = useCurrentGroup();
  const groupMembers = group.members;

  if (!user) {
    throw new Error("Missing user");
  }

  const { expenses } = useExpenses(group.id);
  const { settlements } = useSettlements(group.id);
  const {
    addSettlementPayment,
    addExpensePayment,
    isAddingSettlementPayment,
    isAddingExpensePayment,
  } = usePayments(group.id);

  const [paymentType, setPaymentType] = useState<"settlement" | "expense">(
    "expense"
  );

  const isLoading =
    paymentType === "settlement"
      ? isAddingSettlementPayment
      : isAddingExpensePayment;

  const formSchema = PaymentFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues = {
    amount: 0,
    paidBy: user.id,
    paidTo: "",
    date: DateToYMD(new Date()),
    note: "",
    selectedExpenseIds: [],
    selectedSettlementIds: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const paidBy = useWatch({ control: form.control, name: "paidBy" });
  const paidTo = useWatch({ control: form.control, name: "paidTo" });
  const selectedExpenseIds = form.watch("selectedExpenseIds");
  const selectedSettlementIds = form.watch("selectedSettlementIds");
  const unpaidExpenses = usePayableExpenses(expenses, paidBy, paidTo);
  const expenseItems = usePayableExpenseItems(unpaidExpenses, paidBy);

  // Calculate selected expenses with split amounts
  const selectedExpenses = useMemo(() => {
    return unpaidExpenses
      .filter((expense) => selectedExpenseIds.includes(expense.id))
      .map((expense) => {
        const split = expense.splits.find(
          (split: ExpenseSplit) => split.user.id === paidBy
        );
        return {
          expenseId: expense.id,
          splitAmount: split?.remaining_owing || 0,
        };
      });
  }, [unpaidExpenses, selectedExpenseIds, paidBy]);

  const selectedExpensesTotalAmount = selectedExpenses.reduce(
    (sum, currentExpense) => sum + currentExpense.splitAmount,
    0
  );

  const unpaidSettlements = usePayableSettlements(settlements, paidBy, paidTo);

  const selectedSettlements = useMemo(() => {
    return unpaidSettlements
      .filter((settlement) => selectedSettlementIds.includes(settlement.id))
      .map((settlement) => {
        const paidByParticipant = settlement.participants.find(
          (participant) => participant.user.id === paidBy
        );
        return {
          settlementId: settlement.id,
          amount: Math.max(paidByParticipant?.remaining_balance || 0, 0),
        };
      });
  }, [unpaidSettlements, selectedSettlementIds, paidBy]);

  const selectedSettlementsTotalAmount = selectedSettlements.reduce(
    (sum, settlement) => sum + settlement.amount,
    0
  );

  // Remove any selected expense IDs that are no longer in the unpaid expenses list
  // (e.g., if an expense was paid or removed, auto-deselect it)
  useEffect(() => {
    const allowableExpenseIds = new Set(
      unpaidExpenses.map((expense) => expense.id)
    );
    const filteredIds = selectedExpenseIds.filter((id) =>
      allowableExpenseIds.has(id)
    );

    if (filteredIds.length !== selectedExpenseIds.length) {
      form.setValue("selectedExpenseIds", filteredIds);
    }
  }, [unpaidExpenses, selectedExpenseIds, form]);

  // Remove any selected settlement IDs that are no longer in the open settlements list
  // (e.g., if a settlement was closed or removed, auto-deselect it)
  useEffect(() => {
    const allowableSettlementIds = new Set(
      unpaidSettlements.map((settlement) => settlement.id)
    );
    const filteredIds = selectedSettlementIds.filter((id) =>
      allowableSettlementIds.has(id)
    );

    if (filteredIds.length !== selectedSettlementIds.length) {
      form.setValue("selectedSettlementIds", filteredIds);
    }
  }, [unpaidSettlements, selectedSettlementIds, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (paymentType === "settlement") {
        await addSettlementPayment({
          paid_by: values.paidBy,
          paid_to: values.paidTo,
          amount: values.amount,
          date: values.date,
          settlement_ids:
            values.selectedSettlementIds.length > 0
              ? values.selectedSettlementIds
              : undefined,
          note: values.note,
        });
        toast(`Successfully added payment of ${formatCurrency(values.amount)}`);
      } else if (paymentType === "expense") {
        await addExpensePayment({
          paid_by: values.paidBy,
          paid_to: values.paidTo,
          amount: values.amount,
          date: values.date,
          selectedExpenseSplits: selectedExpenses,
          note: values.note,
        });
        toast(`Successfully added payment of ${formatCurrency(values.amount)}`);
      }

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  // Auto-set paidTo to current user when paidBy changes to someone else
  // assumption is that payment form is used for a payment involving current user (either to or from)
  useEffect(() => {
    if (paidBy && paidBy !== user.id) {
      form.setValue("paidTo", user.id);
    }
    // if paidBy set to curr user when paidTo is curr user, clear paidTo (can't pay yourself)
    else if (paidBy === paidTo) {
      form.setValue("paidTo", "");
    }
  }, [paidBy, user.id, form, paidTo]);

  useEffect(() => {
    if (paidTo && paidTo !== user.id) {
      form.setValue("paidBy", user.id);
    } else if (paidBy === paidTo) {
      form.setValue("paidBy", "");
    }
  }, [paidTo, user.id, form, paidBy]);

  // Clear all selections and reset amount when paidTo is cleared (no recipient selected)
  useEffect(() => {
    if (!paidTo) {
      if (form.getValues("selectedExpenseIds").length > 0) {
        form.setValue("selectedExpenseIds", []);
      }
      if (form.getValues("selectedSettlementIds").length > 0) {
        form.setValue("selectedSettlementIds", []);
      }
      form.setValue("amount", 0);
    }
  }, [paidTo, form]);

  // Auto-update payment amount to match total of selected expenses when payment type is "expense"
  useEffect(() => {
    if (paymentType === "expense") {
      form.setValue("amount", selectedExpensesTotalAmount);
    }
  }, [paymentType, selectedExpensesTotalAmount, form]);

  // Auto-update payment amount to match total of selected settlements when payment type is "settlement"
  useEffect(() => {
    if (paymentType === "settlement") {
      if (selectedSettlementIds.length > 0) {
        form.setValue("amount", selectedSettlementsTotalAmount);
      } else {
        form.setValue("amount", 0);
      }
    }
  }, [
    paymentType,
    selectedSettlementsTotalAmount,
    selectedSettlementIds.length,
    form,
  ]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-5 gap-8 h-full"
        autoComplete="off"
      >
        {/* left side (payment details) */}
        <div className="space-y-4 col-span-2">
          <MemberSelectInput
            control={form.control}
            name="paidBy"
            groupMembers={groupMembers}
            currentUserId={user.id}
          />
          <MemberSelectInput
            control={form.control}
            name="paidTo"
            groupMembers={groupMembers}
            currentUserId={user.id}
            // originally excluded, but might create unexpected ux
            // excludeUserId={paidBy}
          />

          <AmountInput control={form.control} name={"amount"} />

          <DatePickerInput control={form.control} name="date" />

          <NoteInput control={form.control} />
        </div>

        {/* right side (expense/settlement selection) */}
        <div className="flex flex-col space-y-4 col-span-3">
          <div className="flex-1 space-y-4 overflow-hidden">
            <PaymentTypeInput
              value={paymentType}
              onValueChange={(val) =>
                setPaymentType(val as "settlement" | "expense")
              }
            />

            <div className="flex-1 overflow-hidden">
              {!paidBy || !paidTo ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed bg-muted/30 px-4 py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Choose who is paying and who this payment is for to view
                    matching expenses or settlements.
                  </p>
                </div>
              ) : paymentType === "expense" ? (
                expenseItems.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/40 px-4 py-8 text-center">
                    <p className="text-sm font-medium">No unpaid expenses</p>
                    <p className="text-xs text-muted-foreground">
                      Select a different member or add new expenses to settle.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full space-y-4">
                    <FormLabel className="form-item-label">
                      Choose Expenses
                      <span className="text-muted-foreground font-normal text-sm"> (select one or more)</span>
                    </FormLabel>
                    <div className="flex-1 min-h-0">
                      <MultiSelectInput control={form.control} name="selectedExpenseIds" items={expenseItems} />
                    </div>
                  </div>
                )
              ) : (
                <PaymentFormSettlementsPanel<FormValues>
                  control={form.control}
                  name="selectedSettlementIds"
                  settlements={unpaidSettlements}
                  paidBy={paidBy}
                  paidTo={paidTo}
                  hasBothFields={!!paidBy && !!paidTo}
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              Submit Payment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
