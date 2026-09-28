"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    try {
      await api.post("/auth/reset-password", { token, password: data.password });
      setSubmitted(true);
      toast.success("Password reset successfully");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error("Could not reset password.");
    }
  }

  if (submitted) {
    return (
      <div role="status" className="space-y-6 text-center">
        <p className="border border-white/30 px-4 py-4 text-sm text-white/85">
          Your password has been reset. Redirecting to sign in...
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
        <label htmlFor="password" className={authLabelClass}>
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={authInputClass}
          {...form.register("password")}
        />
        <AuthFieldError id="password-error" message={errors.password?.message} />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className={authLabelClass}>
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
          className={authInputClass}
          {...form.register("confirmPassword")}
        />
        <AuthFieldError id="confirm-error" message={errors.confirmPassword?.message} />
      </div>
      <button type="submit" className={authButtonClass} disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset password"}
      </button>
      <p className="pt-2 text-center">
        <Link href="/login" className={authLinkClass}>
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
