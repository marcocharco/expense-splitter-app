"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import PaymentForm from "./PaymentForm";

const NewPaymentSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">New payment</Button>
      </SheetTrigger>
      <SheetContent className="max-w-[50vw]! w-[50vw] px-16 py-16 max-h-screen overflow-y-scroll">
        <SheetHeader className="p-0!">
          <SheetTitle className="text-4xl font-medium">New Payment</SheetTitle>
          <SheetDescription>Log a payment to a group member.</SheetDescription>
        </SheetHeader>
        <PaymentForm onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default NewPaymentSheet;
