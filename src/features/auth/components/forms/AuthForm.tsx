"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import AuthInput from "@/features/auth/components/forms/AuthInput";
import { authFormSchema } from "@/features/auth/schemas/authFormSchema";
import Link from "next/link";
import { signIn, signUp } from "@/features/auth/server/auth.actions";
import { useUser } from "@/features/users/hooks/useUser";
import { getUserProfile } from "@/features/users/queries/getUserProfile";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUser();

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Sign up with supabase auth
      if (type === "sign-in") {
        await signIn(values);
      }
      if (type === "sign-up") {
        await signUp(values);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      const profile = await getUserProfile(); // freshly fetch profile
      setUser(profile);
      setIsLoading(false);
    }
  };
  return (
    <section className="auth-form">
      <p className="auth-header">
        {type === "sign-in" ? "Sign In" : "Sign Up"}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === "sign-up" && (
            <AuthInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter your name"
            />
          )}
          <AuthInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email address"
          />
          <AuthInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
          <div className="flex flex-col w-full">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>

      <footer className="flex flex-row gap-1 justify-center">
        <p className="text-sm text-neutral-500">
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>
        <Link href={type === "sign-in" ? "/sign-up" : "sign-in"}>
          <p className="text-sm text-neutral-600 hover:underline">
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </p>
        </Link>
      </footer>
    </section>
  );
};

export default AuthForm;
