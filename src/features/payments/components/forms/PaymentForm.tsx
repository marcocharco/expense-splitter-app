import { Button } from "@/components/ui/button";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { useUser } from "@/features/users/context/UserContext";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { PaymentFormSchema } from "@/features/payments/schemas/paymentFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import AmountInput from "@/components/forms/AmountInput";
import { Form, FormLabel } from "@/components/ui/form";
import MemberSelectInput from "@/components/forms/MemberSelectInput";
import DatePickerInput from "@/components/forms/DatePickerInput";
import NoteInput from "@/components/forms/NoteInput";
import { getGroupSettlements } from "@/features/settlements/queries/getGroupSettlements";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { ExpenseSplit } from "@/types";
import { DateToYMD } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import MultiSelectInput from "@/components/forms/MultiSelectInput";

const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUser();
  const group = useCurrentGroup();

  if (!user) {
    throw new Error("Missing user");
  }

  const groupMembers = group.members;
  const { expenses } = useExpenses(group.id);
  const {
    addSettlementPayment,
    addExpensePayment,
    isAddingSettlementPayment,
    isAddingExpensePayment,
  } = usePayments(group.id);

  const { data: settlements = [] } = useQuery({
    queryKey: ["groupSettlements", group.id],
    queryFn: () => getGroupSettlements(group.id),
  });
  const [settlementId, setSettlementId] = useState<string | null>(null);

  const formSchema = PaymentFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues = {
    amount: 0,
    paidTo: "",
    date: DateToYMD(new Date()),
    note: "",
    selectedExpenseIds: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [paymentType, setPaymentType] = useState<"settlement" | "balance">(
    "settlement"
  );

  const isLoading =
    paymentType === "settlement"
      ? isAddingSettlementPayment
      : isAddingExpensePayment;

  const paidTo = useWatch({ control: form.control, name: "paidTo" });
  const selectedExpenseIds = form.watch("selectedExpenseIds");

  const unpaidExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const currentUserSplit = expense.splits.find(
        (split) => split.user.id === user.id
      );
      // expenses not in a settlement
      return (
        expense.paid_by.id === paidTo &&
        currentUserSplit &&
        expense.settlement === null &&
        currentUserSplit.remaining_owing > 0
      );
    });
  }, [expenses, paidTo, user.id]);

  // Transform expenses into items format for MultiSelectInput
  const expenseItems = useMemo(() => {
    return unpaidExpenses.reverse().map((expense) => {
      const split = expense.splits.find(
        (split: ExpenseSplit) => split.user.id === user.id
      );
      return {
        id: expense.id,
        label: `${expense.title} - You owe ${formatCurrency(
          split?.remaining_owing || 0
        )}`,
      };
    });
  }, [unpaidExpenses, user.id]);

  // Calculate selected expenses with split amounts
  const selectedExpenses = useMemo(() => {
    return unpaidExpenses
      .filter((expense) => selectedExpenseIds.includes(expense.id))
      .map((expense) => {
        const split = expense.splits.find(
          (split: ExpenseSplit) => split.user.id === user.id
        );
        return {
          expenseId: expense.id,
          splitAmount: split?.amount || 0,
        };
      });
  }, [unpaidExpenses, selectedExpenseIds, user.id]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (paymentType === "settlement") {
        await addSettlementPayment({
          paid_by: user.id,
          paid_to: values.paidTo,
          amount: values.amount,
          date: values.date,
          settlement_id: settlementId,
          note: values.note,
        });
      } else if (paymentType === "balance") {
        await addExpensePayment({
          paid_by: user.id,
          paid_to: values.paidTo,
          amount: values.amount,
          date: values.date,
          selectedExpenseSplits: selectedExpenses,
          note: values.note,
        });
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  const openSettlements = settlements.filter((settlement) => {
    const paidToParticipant = settlement.participants.find(
      (participant) => participant.user.id === paidTo
    );
    const currentUserParticipant = settlement.participants.find(
      (participant) => participant.user.id === user.id
    );
    return (
      paidToParticipant &&
      currentUserParticipant &&
      paidToParticipant.remaining_balance < 0 &&
      currentUserParticipant.remaining_balance > 0
    );
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        autoComplete="off"
      >
        <AmountInput control={form.control} name={"amount"} />
        <MemberSelectInput
          control={form.control}
          name="paidTo"
          formType="payment"
          groupMembers={groupMembers}
          currentUserId={user.id}
        />

        <Tabs
          defaultValue="settlement"
          className="w-[400px]"
          onValueChange={(val) =>
            setPaymentType(val as "settlement" | "balance")
          }
        >
          <TabsList className="w-fit">
            <TabsTrigger value="settlement">Settlement</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
          </TabsList>
          <TabsContent value="settlement">
            {paidTo == "" ? (
              <span>Choose a payment recepient</span>
            ) : openSettlements.length > 0 ? (
              <div className="space-y-2">
                <FormLabel className="form-label">
                  Choose Settlement{" "}
                  <span className="text-muted-foreground font-normal text-sm">
                    (optional)
                  </span>
                </FormLabel>
                {openSettlements.map((settlement) => {
                  const currentUserAmountOwed =
                    settlement.participants.find(
                      (participant) => participant.user.id === user.id
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
                        {settlement.title} - You Owe{" "}
                        {formatCurrency(currentUserAmountOwed)}
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
              <span>No open settlements</span>
            )}
          </TabsContent>
          <TabsContent value="balance">
            {paidTo == "" ? (
              <span>Choose a payment recepient</span>
            ) : unpaidExpenses.length > 0 ? (
              <div className="space-y-4">
                <FormLabel className="form-label">
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
              <span>No unpaid expenses</span>
            )}
          </TabsContent>
        </Tabs>

        <DatePickerInput control={form.control} name="date" />

        <NoteInput control={form.control} />

        <Button type="submit" className="form-btn" disabled={isLoading}>
          Submit Payment
        </Button>
      </form>
    </Form>
  );
};

export default PaymentForm;
