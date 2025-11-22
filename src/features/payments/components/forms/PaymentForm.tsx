import { Button } from "@/components/ui/button";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/context/UserContext";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { PaymentFormSchema } from "@/features/payments/schemas/paymentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import AmountInput from "@/components/forms/AmountInput";
import { Form, FormLabel } from "@/components/ui/form";
import MemberSelectInput from "@/components/forms/MemberSelectInput";
import DatePickerInput from "@/components/forms/DatePickerInput";
import NoteInput from "@/components/forms/NoteInput";
import PaymentTypeInput from "./PaymentTypeInput";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { ExpenseSplit } from "@/types";
import { DateToYMD } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import MultiSelectInput from "@/components/forms/MultiSelectInput";
import { useSettlements } from "@/features/settlements/hooks/useSettlements";
import { toast } from "sonner";

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

  const [settlementId, setSettlementId] = useState<string | null>(null);

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
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const paidBy = useWatch({ control: form.control, name: "paidBy" });
  const paidTo = useWatch({ control: form.control, name: "paidTo" });
  const selectedExpenseIds = form.watch("selectedExpenseIds");

  const unpaidExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const payerSplit = expense.splits.find(
        (split) => split.user.id === paidBy
      );
      // expenses not in a settlement
      return (
        expense.paid_by.id === paidTo &&
        payerSplit &&
        expense.settlement === null &&
        payerSplit.remaining_owing > 0
      );
    });
  }, [expenses, paidTo, paidBy]);

  // Transform expenses into items format for MultiSelectInput
  const expenseItems = useMemo(() => {
    return unpaidExpenses.reverse().map((expense) => {
      const split = expense.splits.find(
        (split: ExpenseSplit) => split.user.id === paidBy
      );
      return {
        id: expense.id,
        label: `${expense.title} - Owes ${formatCurrency(
          split?.remaining_owing || 0
        )}`,
      };
    });
  }, [unpaidExpenses, paidBy]);

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
    (accumulator, currentExpense) => accumulator + currentExpense.splitAmount,
    0
  );

  const openSettlements = settlements.filter((settlement) => {
    const paidToParticipant = settlement.participants.find(
      (participant) => participant.user.id === paidTo
    );
    const paidByParticipant = settlement.participants.find(
      (participant) => participant.user.id === paidBy
    );
    return (
      paidToParticipant &&
      paidByParticipant &&
      paidToParticipant.remaining_balance < 0 &&
      paidByParticipant.remaining_balance > 0
    );
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (paymentType === "settlement") {
        await addSettlementPayment({
          paid_by: values.paidBy,
          paid_to: values.paidTo,
          amount: values.amount,
          date: values.date,
          settlement_id: settlementId,
          note: values.note,
        });
      } else if (paymentType === "expense") {
        await addExpensePayment({
          paid_by: values.paidBy,
          paid_to: values.paidTo,
          amount: values.amount,
          date: values.date,
          selectedExpenseSplits: selectedExpenses,
          note: values.note,
        });
      }
      toast(`Successfully added payment of ${formatCurrency(values.amount)}`);
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
  }, [paidBy, user.id, form]);

  useEffect(() => {
    if (paidTo && paidTo !== user.id) {
      form.setValue("paidBy", user.id);
    } else if (paidBy === paidTo) {
      form.setValue("paidBy", "");
    }
  }, [paidTo, user.id, form]);

  useEffect(() => {
    form.setValue("amount", selectedExpensesTotalAmount);
  }, [selectedExpensesTotalAmount, selectedExpenseIds, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full"
        autoComplete="off"
      >
        {/* left side (payment details) */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MemberSelectInput
              control={form.control}
              name="paidBy"
              formType="payment"
              groupMembers={groupMembers}
              currentUserId={user.id}
            />
            <MemberSelectInput
              control={form.control}
              name="paidTo"
              formType="payment"
              groupMembers={groupMembers}
              currentUserId={user.id}
              // originally excluded, but might create unexpected ux
              // excludeUserId={paidBy}
            />
          </div>

          <AmountInput control={form.control} name={"amount"} />

          <DatePickerInput control={form.control} name="date" />

          <NoteInput control={form.control} />
        </div>

        {/* right side (expense/settlemnt selection) */}
        <div className="flex flex-col space-y-4">
          <div className="flex-1 space-y-4">
            <PaymentTypeInput
              value={paymentType}
              onValueChange={(val) =>
                setPaymentType(val as "settlement" | "expense")
              }
            />

            {/* Payment Type Content */}
            <div className="space-y-4">
              {paymentType === "settlement" ? (
                <div>
                  {paidTo === "" ? (
                    <span className="text-muted-foreground font-normal text-sm">
                      Choose a payment recipient
                    </span>
                  ) : openSettlements.length > 0 ? (
                    <div className="space-y-2">
                      <FormLabel className="form-item-label">
                        Choose Settlement{" "}
                        <span className="text-muted-foreground font-normal text-sm">
                          (optional)
                        </span>
                      </FormLabel>
                      {openSettlements.map((settlement) => {
                        const paidByAmountOwed =
                          settlement.participants.find(
                            (participant) => participant.user.id === paidBy
                          )?.remaining_balance || 0;

                        return (
                          <div
                            key={settlement.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name="settlement"
                              value={settlement.id}
                              checked={settlementId === settlement.id}
                              onChange={() => setSettlementId(settlement.id)}
                              id={`settlement-${settlement.id}`}
                            />
                            <label
                              htmlFor={`settlement-${settlement.id}`}
                              className="text-sm"
                            >
                              {settlement.title} - Owes{" "}
                              <span>{formatCurrency(paidByAmountOwed)}</span>
                            </label>
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="settlement"
                          value=""
                          checked={settlementId === null}
                          onChange={() => setSettlementId(null)}
                          id="settlement-none"
                        />
                        <label htmlFor="settlement-none" className="text-sm">
                          None (General Payment)
                        </label>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground font-normal text-sm">
                      No open settlements
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  {paidTo === "" ? (
                    <span className="text-muted-foreground font-normal text-sm">
                      Choose a payment recipient
                    </span>
                  ) : unpaidExpenses.length > 0 ? (
                    <div className="space-y-4">
                      <FormLabel className="form-item-label">
                        Choose Expenses
                        <span className="text-muted-foreground font-normal text-sm">
                          {" "}
                          (select one or more)
                        </span>
                      </FormLabel>
                      <MultiSelectInput<FormValues>
                        control={form.control}
                        name="selectedExpenseIds"
                        items={expenseItems}
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground font-normal text-sm">
                      No unpaid expenses
                    </span>
                  )}
                </div>
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
