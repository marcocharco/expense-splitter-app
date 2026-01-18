"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import AuthInput from "@/features/auth/components/forms/AuthInput";
import Link from "next/link";
import { resetPasswordForEmail } from "@/features/auth/server/auth.actions";

const forgotPasswordSchema = z.object({
  email: z.string().email().max(255),
});

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPasswordForEmail(values.email);
      if (result.error) {
        setError(result.error);
      } else {
        setIsSubmitted(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="auth-form">
        <p className="auth-header">Check your email</p>
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 text-center">
            We&apos;ve sent a password reset link to {form.getValues("email")}
          </p>
          <p className="text-sm text-neutral-500 text-center">
            Click the link in the email to reset your password.
          </p>
          <div className="flex flex-col w-full mt-8">
            <Link href="/sign-in">
              <Button className="form-btn w-full">Back to Sign In</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-form">
      <p className="auth-header">Forgot Password</p>
      <p className="text-sm text-neutral-600 text-left">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AuthInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email address"
          />
          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}
          <div className="flex flex-col w-full">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </Form>

      <footer className="flex flex-row gap-1 justify-center">
        <p className="text-sm text-neutral-500">Remember your password?</p>
        <Link href="/sign-in">
          <p className="text-sm text-neutral-600 hover:underline">Sign In</p>
        </Link>
      </footer>
    </section>
  );
};

export default ForgotPasswordForm;
