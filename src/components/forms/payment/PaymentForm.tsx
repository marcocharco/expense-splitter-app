import { Button } from "@/components/ui/button";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import { useUser } from "@/context/UserContext";
import { addNewPayment } from "@/lib/actions/payment.actions";
import React from "react";

const PaymentForm = () => {
  const { user } = useUser();
  const group = useCurrentGroup();

  if (!user || !group) {
    throw new Error("Missing user or group");
  }

  const profileId = "";
  const settlementId = "";

  const onSubmit = async () => {
    await addNewPayment({
      groupId: group.id,
      paid_by: user.id,
      paid_to: profileId,
      amount: 400,
      settlement_id: settlementId,
      note: "Paid half rent",
    });
  };
  return (
    <>
      <Button variant="outline" onClick={onSubmit}>
        Submit Payment
      </Button>
    </>
  );
};

export default PaymentForm;
