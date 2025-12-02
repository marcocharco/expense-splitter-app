"use server";

import { createClient } from "@/utils/supabase/server";
import { NewGroup } from "@/types";
import { revalidatePath } from "next/cache";

export async function createGroup(values: NewGroup) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Call RPC function to create group with members
  const { data, error } = await supabase.rpc("insert_group_with_members", {
    p_group_name: values.title,
    p_creator_id: user.id,
    p_member_emails: values.memberEmails.map((email) =>
      email.toLowerCase().trim()
    ),
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !data.slug) {
    throw new Error("Failed to create group");
  }

  // TODO: Send invitation emails for pending invitations
  // For now, invitations are created in the database
  // You can add email sending logic here using Supabase Edge Functions or external service

  revalidatePath("/", "layout");

  // Return the data and let client handle navigation
  // This makes sure React Query invalidation completes before navigation
  return {
    success: true,
    slug: data.slug,
    groupId: data.group_id,
  };
}

export async function acceptGroupInvitation(token: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase.rpc("accept_group_invitation", {
    p_token: token,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !data.success) {
    throw new Error(data?.error || "Failed to accept invitation");
  }

  revalidatePath("/", "layout");

  // Return the data and let client handle navigation
  // This makes sure React Query invalidation completes before navigation
  return {
    success: true,
    groupSlug: data.group_slug,
    groupId: data.group_id,
  };
}
