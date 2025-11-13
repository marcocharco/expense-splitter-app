"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiItemExpenseFormSchema } from "@/features/expenses/schemas/expenseFormSchema";
import { useUser } from "@/features/users/context/UserContext";
import { useCurrentGroup } from "@/features/groups/contexts/CurrentGroupContext";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ExpenseGeneralInfoSection from "@/features/expenses/components/forms/ExpenseGeneralInfoSection";
import ExpenseMultiItemSection from "@/features/expenses/components/forms/ExpenseMultiItemSection";
import { useExpenses } from "@/features/expenses/hooks/useExpenses";
import { DateToYMD } from "@/utils/formatDate";
import { toast } from "sonner";
import { Expense } from "@/types";
import { toMultiItemFormValues } from "../../utils/expenseMapper";

type MultiItemExpenseFormProps = {
  type: "newExpense" | "updateExpense";
  initialExpense?: Expense;
  onSuccess: () => void;
};

const MultiItemExpenseForm = ({
  type,
  initialExpense,
  onSuccess,
}: MultiItemExpenseFormProps) => {
  const { user } = useUser();
  const groupData = useCurrentGroup();

  if (!user) {
    throw new Error("Missing user");
  }

  const groupMembers = groupData.members;
  const {
    addMultiItemExpense,
    editMultiItemExpense,
    isAddingMultiItemExpense,
    isEditingMultiItemExpense,
  } = useExpenses(groupData.id);

  const formSchema = MultiItemExpenseFormSchema();
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues: FormValues =
    type === "updateExpense"
      ? toMultiItemFormValues({
          expense: initialExpense!,
          members: groupMembers,
        })
      : initialExpense
      ? {
          ...toMultiItemFormValues({
            expense: initialExpense,
            members: groupMembers,
          }),
          date: DateToYMD(new Date()),
        }
      : {
          title: "",
          paidBy: user.id ?? "",
          date: DateToYMD(new Date()),
          category: undefined,
          items: [],
        };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isLoading =
    type === "newExpense"
      ? isAddingMultiItemExpense
      : isEditingMultiItemExpense;

  const onSubmit = async (values: FormValues) => {
    // Transform form values to match backend payload structure
    const payload = {
      title: values.title,
      paidBy: values.paidBy,
      date: values.date,
      category: values.category,
      items: values.items.map((item) => ({
        title: item.title,
        amount: item.amount,
        splitType: item.splitType,
        splits: item.memberSplits.filter((split) =>
          item.selectedMembers.includes(split.userId)
        ),
      })),
    };

    try {
      if (type === "newExpense") {
        await addMultiItemExpense(payload);
        toast(`Successfully added "${values.title}"`);
        onSuccess();
      } else if (type === "updateExpense" && initialExpense) {
        await editMultiItemExpense({
          values: payload,
          expenseId: initialExpense.id,
        });
        toast(`Successfully edited "${values.title}"`);
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save expense");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-auto"
        autoComplete="off"
      >
        {/* left side (general expense info) */}
        <ExpenseGeneralInfoSection
          control={form.control}
          groupMembers={groupMembers}
          currentUserId={user.id ?? ""}
          groupId={groupData.id}
        />

        {/* right side (items array) */}
        <div className="flex flex-col">
          <ExpenseMultiItemSection
            control={form.control}
            setValue={form.setValue}
            setError={form.setError}
            clearErrors={form.clearErrors}
            groupMembers={groupMembers}
          />

          {/* submit form button */}
          <div className="flex justify-end">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {type === "newExpense" ? "Add Expense" : "Update Expense"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MultiItemExpenseForm;
