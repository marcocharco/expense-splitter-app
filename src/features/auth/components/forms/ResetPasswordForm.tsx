"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthInput from "@/features/auth/components/forms/AuthInput";
import Link from "next/link";
import { updatePassword } from "@/features/auth/server/auth.actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const supabase = createClient();

    // Check if we have a valid password recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidToken(true);
      } else {
        // Listen for PASSWORD_RECOVERY event
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "PASSWORD_RECOVERY") {
            setIsValidToken(true);
          } else if (event === "SIGNED_OUT" || !session) {
            setIsValidToken(false);
          }
        });
      }
    });
  }, []);

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updatePassword(values.password);
      if (result.error) {
        setError(result.error);
      } else {
        // Password updated successfully, redirect to sign in
        router.push("/sign-in");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <section className="auth-form">
        <p className="auth-header">Reset Password</p>
        <p className="text-sm text-neutral-600 text-center">
          Verifying reset link...
        </p>
      </section>
    );
  }

  if (isValidToken === false) {
    return (
      <section className="auth-form">
        <p className="auth-header">Invalid Reset Link</p>
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 text-center">
            This password reset link is invalid or has expired.
          </p>
          <p className="text-sm text-neutral-500 text-center">
            Please request a new password reset link.
          </p>
          <div className="flex flex-col w-full mt-8">
            <Link href="/forgot-password">
              <Button className="form-btn w-full">Request New Link</Button>
            </Link>
          </div>
          <div className="flex flex-row gap-1 justify-center">
            <p className="text-sm text-neutral-500">Remember your password?</p>
            <Link href="/sign-in">
              <p className="text-sm text-neutral-600 hover:underline">
                Sign In
              </p>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-form">
      <p className="auth-header">Reset Password</p>
      <p className="text-sm text-neutral-600 text-center mb-6">
        Enter your new password below.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AuthInput
            control={form.control}
            name="password"
            label="New Password"
            placeholder="Enter your new password"
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <div className="form-item">
                <FormLabel className="form-item-label">
                  Confirm Password
                </FormLabel>
                <div className="flex flex-col w-full">
                  <FormControl>
                    <Input
                      placeholder="Confirm your new password"
                      className="input-class"
                      id="confirmPassword"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="form-item-message" />
                </div>
              </div>
            )}
          />
          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}
          <div className="flex flex-col w-full">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
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

export default ResetPasswordForm;
