"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newExpenseFormSchema } from "@/lib/utils";

import { useUser } from "@/context/UserContext";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import { useRouter } from "next/navigation";

import { addNewExpense } from "@/lib/actions/expense.actions";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import ExpenseAmountInput from "./ExpenseAmountInput";
import ExpenseTitleInput from "./ExpenseTitleInput";
import ExpensePaidByInput from "./ExpensePaidByInput";
import ExpenseDateInput from "./ExpenseDateInput";
import ExpenseSplitTypeInput from "./ExpenseSplitTypeInput";
import ExpenseSplitDetailsInput from "./ExpenseSplitDetailsInput";
import ExpenseCategoryInput from "./ExpenseCateogryInput";

const NewExpenseForm = () => {
  const router = useRouter();
  const { user } = useUser();
  const groupData = useCurrentGroup();
  const groupMembers = groupData?.members ?? [];

  const formSchema = newExpenseFormSchema();

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.0,
      title: "",
      paidBy: user?.id,
      date: new Date().toISOString(),
      category: "",
      splitType: "even",
      memberSplits: groupMembers.map((member) => ({
        userId: member.id,
        split: 0,
      })),
      selectedMembers: user ? [user.id] : [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    const { selectedMembers, memberSplits, ...rest } = values;

    const filteredSplits = memberSplits.filter((split) =>
      selectedMembers.includes(split.userId)
    );
    setIsLoading(true);
    try {
      await addNewExpense(
        { ...rest, memberSplits: filteredSplits },
        groupData?.id as string
      );
      router.push(`/groups/${groupData?.slug}`);
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
        <ExpenseAmountInput control={form.control} />

        <ExpenseTitleInput control={form.control} />

        <ExpensePaidByInput
          groupMembers={groupMembers}
          currentUserId={user?.id ?? ""}
        />

        <ExpenseDateInput />

        <ExpenseCategoryInput control={form.control} />

        <ExpenseSplitTypeInput />

        <ExpenseSplitDetailsInput
          groupMembers={groupMembers}
          control={form.control}
          setValue={form.setValue}
        />

        <Button type="submit" className="form-btn" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewExpenseForm;
