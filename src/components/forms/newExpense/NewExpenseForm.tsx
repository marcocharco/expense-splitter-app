"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newExpenseFormSchema } from "@/lib/utils";

import { useUser } from "@/context/UserContext";
import { useCurrentGroup } from "@/context/CurrentGroupContext";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { addNewExpense } from "@/lib/actions/expense.actions";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";

import NewExpenseInput from "./NewExpenseInput";

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
      paid_by: user?.id,
      date: new Date().toISOString(),
      category: "",
      split_type: "even",
      member_splits: groupMembers.map((member) => ({
        user_id: member.id,
        split: 0,
      })),
      selected_members: user ? [user.id] : [],
    },
  });

  const splitType = useWatch({ control: form.control, name: "split_type" });
  const selectedMembers = useWatch({
    control: form.control,
    name: "selected_members",
  });
  const memberSplits = useWatch({
    control: form.control,
    name: "member_splits",
  });
  const memberIndexMap = Object.fromEntries(
    memberSplits.map((m, i) => [m.user_id, i])
  );

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    const { selected_members, member_splits, ...rest } = values;

    const filteredSplits = member_splits.filter((split) =>
      selected_members.includes(split.user_id)
    );
    setIsLoading(true);
    try {
      await addNewExpense(
        { ...rest, member_splits: filteredSplits },
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

        <FormField
          name="paid_by"
          render={({ field }) => (
            <>
              <FormLabel className="form-label">Paid By</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select who paid" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} {member.id === user?.id && "(you)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="form-message" />
            </>
          )}
        />

        <FormField
          name="date"
          render={({ field }) => (
            <>
              <FormLabel className="form-label">Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {field.value ? (
                        new Date(field.value).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : "");
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage className="form-message" />
            </>
          )}
        />

        <NewExpenseInput
          control={form.control}
          name="category"
          label="Category"
          placeholder="Enter the expense category"
        />

        <FormField
          name="split_type"
          render={({ field }) => (
            <>
              <FormLabel className="form-label">Split Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a split type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="even">Even</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="shares">Shares</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="form-message" />
            </>
          )}
        />

        <FormField
          name="selected_members"
          render={({ field }) => (
            <>
              <FormLabel className="form-label">
                Select included members
              </FormLabel>
              <FormControl>
                <div>
                  {groupMembers.map((member) => {
                    const isChecked = field.value?.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={member.id}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value || []), member.id]
                              : field.value.filter(
                                  (id: string) => id !== member.id
                                );
                            field.onChange(newValue);
                          }}
                        />
                        <label htmlFor={member.id}>{member.name}</label>
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage className="form-message" />
            </>
          )}
        />

        <FormLabel className="form-label">Splits</FormLabel>

        {groupMembers.map((member) => {
          const isSelected = selectedMembers.includes(member.id);
          const memberIndex = memberIndexMap[member.id];

          return (
            <div key={member.id} className="flex items-center space-x-4">
              <span className="w-32">{member.name}</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                disabled={splitType === "even" || !isSelected}
                {...form.register(`member_splits.${memberIndex}.split`, {
                  valueAsNumber: true,
                })}
                className="w-32"
              />
              <FormMessage className="form-message" />
            </div>
          );
        })}

        <Button type="submit" className="form-btn" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default NewExpenseForm;
