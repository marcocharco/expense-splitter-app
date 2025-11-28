"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";
import { useUser } from "@/features/users/context/UserContext";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ExpenseGeneralInfoSection from "@/features/expenses/components/forms/ExpenseGeneralInfoSection";
import ExpenseSingleItemSection from "@/features/expenses/components/forms/ExpenseSingleItemSection";
import { Expense } from "@/types";
import { toSingleItemFormValues } from "@/features/expenses/utils/expenseMapper";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { DateToYMD } from "@/utils/formatDate";
import { toast } from "sonner";

type SingleItemExpenseFormProps = {
  type: "newExpense" | "updateExpense";
  initialExpense?: Expense;
  onSuccess: () => void;
};

const SingleItemExpenseForm = ({
  type,
  initialExpense,
  onSuccess,
}: SingleItemExpenseFormProps) => {
  const { user } = useUser();
  const groupData = useCurrentGroup();

  if (!user) {
    throw new Error("Missing user");
  }

  const groupMembers = groupData.members;
  const { addExpense, editExpense, isAddingExpense, isEditingExpense } =
    useExpenses(groupData.id);

  const formSchema = ExpenseFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues =
    type === "updateExpense"
      ? toSingleItemFormValues({
          expense: initialExpense!,
          members: groupMembers,
        })
      : initialExpense
      ? {
          // default to the current date for duplicate expenses
          ...toSingleItemFormValues({
            expense: initialExpense,
            members: groupMembers,
          }),
          date: DateToYMD(new Date()), // Reset to today's date
        }
      : {
          amount: 0,
          title: "",
          paidBy: user.id ?? "",
          date: DateToYMD(new Date()),
          category: undefined,
          splitType: "even",
          selectedMembers: user ? [user.id] : [],
          memberSplits: groupMembers.map((m) => ({ userId: m.id, weight: 0 })),
        };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isLoading = type === "newExpense" ? isAddingExpense : isEditingExpense;

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title,
      amount: values.amount,
      paidBy: values.paidBy,
      date: values.date,
      category: values.category,
      splitType: values.splitType,
      memberSplits: values.memberSplits.filter((split) =>
        values.selectedMembers.includes(split.userId)
      ),
    };

    try {
      if (type === "newExpense") {
        await addExpense(payload);
        toast(`Successfully added "${values.title}"`);
        onSuccess();
      } else if (type === "updateExpense" && initialExpense) {
        await editExpense({
          values: payload,
          expenseId: initialExpense.id,
        });
        toast(`Successfully updated "${values.title}"`);
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-5 gap-8 h-full"
        autoComplete="off"
      >
        {/* left side (general expense info) */}
        <div className="col-span-2">
          <ExpenseGeneralInfoSection
            control={form.control}
            groupMembers={groupMembers}
            currentUserId={user.id ?? ""}
            groupId={groupData.id}
          />
        </div>

        {/* right side (split info) */}
        <div className="flex flex-col space-y-4 col-span-3">
          <ExpenseSingleItemSection
            control={form.control}
            setValue={form.setValue}
            setError={form.setError}
            clearErrors={form.clearErrors}
            groupMembers={groupMembers}
          />

          {/* submit form button */}
          <div className="flex justify-end mt-4">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {type === "newExpense" ? "Add Expense" : "Update Expense"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SingleItemExpenseForm;
