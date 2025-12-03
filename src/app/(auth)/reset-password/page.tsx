import ResetPasswordForm from "@/features/auth/components/forms/ResetPasswordForm";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

interface ResetPasswordProps {
  searchParams: {
    token_hash?: string;
    type?: string;
  };
}

const ResetPassword = async ({ searchParams }: ResetPasswordProps) => {
  // If we have token parameters, verify them server-side
  if (searchParams.token_hash && searchParams.type === "recovery") {
    const supabase = await createClient();
    await supabase.auth.verifyOtp({
      type: "recovery" as EmailOtpType,
      token_hash: searchParams.token_hash,
    });
  }

  return (
    <section className="flex items-center justify-center size-full max-sm:px-6">
      <ResetPasswordForm />
    </section>
  );
};

export default ResetPassword;

