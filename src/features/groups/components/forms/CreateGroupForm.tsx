"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { groupFormSchema } from "@/features/groups/schemas/groupFormSchema";
import { createGroup } from "@/features/groups/server/group.actions";
import { useUser } from "@/features/users/hooks/useUser";
import { X } from "lucide-react";
import { toast } from "sonner";

type FormValues = z.infer<typeof groupFormSchema>;

const CreateGroupForm = () => {
  const { user } = useUser();
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      title: "",
      memberEmails: [],
    },
  });

  const memberEmails = form.watch("memberEmails");

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim().toLowerCase();

    if (!trimmedEmail) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if email is already in list
    if (memberEmails.includes(trimmedEmail)) {
      toast.error("This email is already in the list");
      return;
    }

    // Check if email is the creator's email
    if (user?.email && trimmedEmail === user.email.toLowerCase()) {
      toast.error("You cannot add your own email");
      return;
    }

    // Add email to form
    form.setValue("memberEmails", [...memberEmails, trimmedEmail]);
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    form.setValue(
      "memberEmails",
      memberEmails.filter((email) => email !== emailToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await createGroup(values);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create group"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter group name"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memberEmails"
          render={() => (
            <FormItem>
              <FormLabel>
                Invite Members{" "}
                <span className="text-muted-foreground font-normal text-sm">
                  (at least 2)
                </span>
              </FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      type="button"
                      onClick={handleAddEmail}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>

                  {memberEmails.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {memberEmails.map((email) => (
                        <Badge
                          key={email}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(email)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting} className="form-btn">
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateGroupForm;
