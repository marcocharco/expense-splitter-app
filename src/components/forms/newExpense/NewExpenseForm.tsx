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
import { calculateSplitCosts } from "@/utils/splitCalculator";
import { calculateTotalShares } from "@/utils/totalSharesCalculator";

const NewExpenseForm = () => {
  const router = useRouter();
  const { user } = useUser();
  const groupData = useCurrentGroup();
  const groupMembers = groupData?.members ?? [];

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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

  const currentAmount = useWatch({ control: form.control, name: "amount" });
  const splitType = useWatch({ control: form.control, name: "splitType" });
  const selectedMembers = useWatch({
    control: form.control,
    name: "selectedMembers",
  });
  const memberSplits = useWatch({
    control: form.control,
    name: "memberSplits",
  });
  const memberIndexMap = Object.fromEntries(
    memberSplits.map((m, i) => [m.userId, i])
  );
  const splitCosts =
    calculateSplitCosts({
      type: splitType,
      totalAmount: currentAmount,
      memberSplits: memberSplits,
      selectedMembers: selectedMembers,
    }) || [];

  const totalShares = calculateTotalShares(memberSplits, selectedMembers);

  const splitCostLabel = (() => {
    switch (splitType) {
      case "even":
        return "";
      case "percentage":
        return "%";
      case "shares":
        return `/${totalShares}`;
      case "custom":
        return "$";
      default:
        return "";
    }
  })();

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
          name="paidBy"
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
          name="splitType"
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

        <FormLabel className="form-label">Splits</FormLabel>

        {groupMembers.map((member) => {
          const isSelected = selectedMembers.includes(member.id);
          const memberIndex = memberIndexMap[member.id];
          const splitAmount =
            splitCosts.find((s) => s.userId === member.id)?.amount ?? 0;

          return (
            <div key={member.id} className="flex items-center space-x-4">
              <Checkbox
                id={member.id}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(selectedMembers || []), member.id]
                    : selectedMembers.filter((id: string) => id !== member.id);
                  form.setValue("selectedMembers", newValue);
                }}
              />
              <span className="w-32">{member.name}</span>
              <span>
                {currencyFormatter.format(isSelected ? splitAmount || 0 : 0)}
              </span>
              <FormField
                name={`memberSplits.${memberIndex}.split`}
                render={({ field }) => (
                  <>
                    {splitType !== "even" && (
                      <div className="relative">
                        <Input
                          placeholder="0"
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
                          disabled={!isSelected}
                          value={isSelected ? field.value : 0}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow up to 2 decimal places
                            if (value.includes(".")) {
                              const [, decimal] = value.split(".");
                              if (decimal && decimal.length > 2) {
                                return;
                              }
                            }
                            field.onChange(value === "" ? "" : Number(value));
                          }}
                          className="w-32 pr-16 input-no-spinner"
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                          {splitCostLabel}
                        </span>
                      </div>
                    )}
                    <FormMessage className="form-message" />
                  </>
                )}
              />
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
