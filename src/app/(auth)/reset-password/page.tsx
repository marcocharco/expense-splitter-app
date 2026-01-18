import ResetPasswordForm from "@/features/auth/components/forms/ResetPasswordForm";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

interface ResetPasswordProps {
  searchParams: Promise<{
    token_hash?: string;
    type?: string;
  }>;
}

const ResetPassword = async ({ searchParams }: ResetPasswordProps) => {
  const { token_hash, type } = await searchParams;

  // If we have token parameters, verify them server-side
  if (token_hash && type === "recovery") {
    const supabase = await createClient();
    await supabase.auth.verifyOtp({
      type: "recovery" as EmailOtpType,
      token_hash: token_hash,
    });
  }

  return (
    <section className="flex items-center justify-center size-full max-sm:px-6">
      <ResetPasswordForm />
    </section>
  );
};

export default ResetPassword;

