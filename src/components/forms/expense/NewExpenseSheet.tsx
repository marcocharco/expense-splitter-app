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

import ExpenseForm from "./ExpenseForm";

const NewExpenseSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Add expense</Button>
      </SheetTrigger>
      <SheetContent className="max-w-[50vw]! w-[50vw] px-16 py-16 max-h-screen overflow-y-scroll">
        <SheetHeader className="p-0!">
          <SheetTitle className="text-4xl font-medium">Add expense</SheetTitle>
          <SheetDescription>
            Add a new expense to split amongst group members.
          </SheetDescription>
        </SheetHeader>
        <ExpenseForm type="newExpense" onSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default NewExpenseSheet;
