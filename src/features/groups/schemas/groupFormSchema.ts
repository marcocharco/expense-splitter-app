import { z } from "zod";

export const groupFormSchema = z.object({
  title: z.string().min(1, "Group title is required").max(255, "Title is too long"),
  memberEmails: z
    .array(z.string().email("Invalid email address"))
    .min(2, "At least 2 members are required (excluding yourself)")
    .refine(
      (emails) => {
        const uniqueEmails = new Set(emails.map((e) => e.toLowerCase().trim()));
        return uniqueEmails.size === emails.length;
      },
      {
        message: "Duplicate emails are not allowed",
      }
    ),
});

