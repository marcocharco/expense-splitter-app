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
import SettlementForm from "@/features/settlements/components/forms/SettlementForm";

const NewSettlementSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Settle Expenses</Button>
      </SheetTrigger>
      <SheetContent className="max-w-[50vw]! w-[50vw] px-16 py-16 max-h-screen overflow-y-scroll">
        <SheetHeader className="p-0!">
          <SheetTitle className="text-4xl font-medium">
            Settle Expenses
          </SheetTitle>
          <SheetDescription>Settle group balances</SheetDescription>
        </SheetHeader>
        <SettlementForm onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default NewSettlementSheet;
