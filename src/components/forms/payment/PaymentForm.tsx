import { Button } from "@/components/ui/button";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import { useUser } from "@/context/UserContext";
import { addNewPayment } from "@/lib/actions/payment.actions";
import { PaymentFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AmountInput from "../AmountInput";
import { Form, FormLabel } from "@/components/ui/form";
import MemberSelectInput from "../MemberSelectInput";
import DatePickerInput from "../DatePickerInput";
import NoteInput from "../NoteInput";
import { getGroupSettlements } from "@/lib/queries/getGroupSettlements";
import { useQuery } from "@tanstack/react-query";

const PaymentForm = () => {
  const { user } = useUser();
  const group = useCurrentGroup();

  if (!user || !group) {
    throw new Error("Missing user or group");
  }

  const groupMembers = group.members;

  const { data: settlements = [] } = useQuery({
    queryKey: ["group-settlements", group.id],
    queryFn: () => getGroupSettlements(group.id),
  });
  const [settlementId, setSettlementId] = useState<string | null>(null);

  const formSchema = PaymentFormSchema();

  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues = {
    amount: 0,
    paidTo: "",
    date: new Date().toISOString(),
    note: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await addNewPayment({
        groupId: group.id,
        paid_by: user.id,
        paid_to: values.paidTo,
        amount: values.amount,
        settlement_id: settlementId,
        note: values.note,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
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

        {/* Temporary settlement selection */}
        {settlements && settlements.length > 0 && (
          <div className="space-y-2">
            <FormLabel className="form-label">
              Choose Settlement{" "}
              <span className="text-muted-foreground font-normal text-sm">
                (optional)
              </span>
            </FormLabel>
            {settlements.map((settlement) => (
              <div key={settlement.id} className="flex items-center gap-2">
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
                  {settlement.title}
                </label>
              </div>
            ))}
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
        )}

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
