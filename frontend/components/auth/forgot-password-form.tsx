"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  AuthFieldError,
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from "./auth-shell";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(data: FormData) {
    try {
      await api.post("/auth/forgot-password", data);
      setSubmitted(true);
    } catch {
      toast.error("Could not send reset email.");
    }
  }

  if (submitted) {
    return (
      <div role="status" className="space-y-6 text-center">
        <p className="border border-white/30 px-4 py-4 text-sm text-white/85">
          If an account exists for that email, a reset link has been sent.
        </p>
        <Link href="/login" className={authLinkClass}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className={authLabelClass}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@st.ug.edu.gh"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={authInputClass}
          {...form.register("email")}
        />
        <AuthFieldError id="email-error" message={errors.email?.message} />
      </div>
      <button type="submit" className={authButtonClass} disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset link"}
      </button>
      <p className="pt-2 text-center">
        <Link href="/login" className={authLinkClass}>
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
