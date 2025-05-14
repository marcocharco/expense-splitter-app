"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
        router.push("/");
      }
      if (type === "sign-up") {
        await signUp(values);
        router.push("/");
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
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
            <CustomInput
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter your name"
            />
          )}
          <CustomInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter your email address"
          />
          <CustomInput
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
