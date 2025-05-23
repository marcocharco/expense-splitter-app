"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import NewExpenseInput from "./NewExpenseInput";
import { newExpenseFormSchema } from "@/lib/utils";
import { addNewExpense } from "@/lib/actions/expense.actions";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import { useRouter } from "next/navigation";

const NewExpenseForm = () => {
  const router = useRouter();
  const group_data = useCurrentGroup();

  const formSchema = newExpenseFormSchema();

  const [isLoading, setIsLoading] = useState(false);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0.0,
      title: "",
      paid_by: "",
      date: "",
      category: "",
      split_type: "Even",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    // HARD CODED MEMBER SPLITS FOR TESTING
    const memberIds: { user_id: string }[] =
      group_data?.members.map((member) => ({ user_id: member.id })) ?? [];
    try {
      await addNewExpense(values, group_data?.id as string, memberIds);
      router.push(`/groups/${group_data?.slug}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <NewExpenseInput
          control={form.control}
          name="amount"
          label="Amount"
          placeholder="0.00"
        />
        <NewExpenseInput
          control={form.control}
          name="title"
          label="Title"
          placeholder="Enter the expense item"
        />
        <NewExpenseInput
          control={form.control}
          name="paid_by"
          label="Paid By"
          placeholder="Enter who paid for the item"
        />
        <NewExpenseInput
          control={form.control}
          name="date"
          label="Date"
          placeholder="Enter the date of the expense"
        />
        <NewExpenseInput
          control={form.control}
          name="category"
          label="Category"
          placeholder="Enter the expense category"
        />
        <NewExpenseInput
          control={form.control}
          name="split_type"
          label="Split Type"
          placeholder="Enter the split type"
        />
        <Button type="submit" className="form-btn" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewExpenseForm;
