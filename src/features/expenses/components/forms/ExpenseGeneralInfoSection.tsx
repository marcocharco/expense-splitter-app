"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import TitleInput from "@/components/forms/TitleInput";
import MemberSelectInput from "@/components/forms/MemberSelectInput";
import DatePickerInput from "@/components/forms/DatePickerInput";
import ExpenseCategoryInput from "@/features/expenses/components/forms/ExpenseCategoryInput";
import { Member } from "@/types";

type ExpenseGeneralInfoSectionProps<T extends FieldValues = FieldValues> = {
  control: Control<T>;
  groupMembers: Member[];
  currentUserId: string;
  groupId: string;
};

const ExpenseGeneralInfoSection = <T extends FieldValues = FieldValues>({
  control,
  groupMembers,
  currentUserId,
  groupId,
}: ExpenseGeneralInfoSectionProps<T>) => {
  return (
    <div className="space-y-4">
      <TitleInput
        control={control}
        name={"title" as Path<T>}
        label="Title"
        placeholder="e.g. Grocery bill, Flight tickets, etc."
      />

      <MemberSelectInput
        control={control}
        name={"paidBy" as Path<T>}
        formType="expense"
        groupMembers={groupMembers}
        currentUserId={currentUserId}
      />

      <DatePickerInput control={control} name={"date" as Path<T>} />

      <ExpenseCategoryInput control={control} groupId={groupId} />
    </div>
  );
};

export default ExpenseGeneralInfoSection;
