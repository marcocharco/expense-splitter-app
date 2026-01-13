"use client";

import { useState } from "react";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { usePayments } from "@/features/payments/hooks/usePayments";
import { PaymentTable } from "./table/PaymentTable";
import { createPaymentTableColumns } from "./table/PaymentTableColumns";
import { Payment } from "../types/payment";
import { PaymentDetailsSheet } from "./PaymentDetailsSheet";

const PaymentList = () => {
  const group = useCurrentGroup();
  const { payments, isLoading } = usePayments(group.id);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const columns = createPaymentTableColumns((payment) => {
    setSelectedPayment(payment);
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading payments...
      </div>
    );
  }

  return (
    <>
      <PaymentTable
        columns={columns}
        data={payments}
        onRowClick={(payment) => setSelectedPayment(payment)}
      />

      <PaymentDetailsSheet
        payment={selectedPayment}
        onOpenChange={setSelectedPayment}
      />
    </>
  );
};

export default PaymentList;
