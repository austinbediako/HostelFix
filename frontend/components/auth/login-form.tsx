"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LockKeyhole } from "lucide-react";
import { useLogin } from "@/hooks/use-auth";
import { useAuthContext } from "@/providers/auth-provider";
import { getDefaultRoute } from "@/lib/auth";
import {
  AuthFieldError,
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from "./auth-shell";

const loginSchema = z.object({
  id: z.string().min(8, "ID must be at least 8 characters"),
  pin: z.string().regex(/^\d{5}$/, "PIN must be exactly 5 digits"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();
  const { user: sessionUser, isLoading: sessionLoading } = useAuthContext();

  useEffect(() => {
    if (!sessionLoading && sessionUser && !login.isPending) {
      router.replace(getDefaultRoute(sessionUser.role));
    }
  }, [sessionUser, sessionLoading, login.isPending, router]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { id: "", pin: "" },
  });
  const { errors } = form.formState;

  async function onSubmit(data: LoginFormData) {
    try {
      const user = await login.mutateAsync(data);
      toast.success(`Welcome back, ${user.name}`);
      router.push(getDefaultRoute(user.role));
      router.refresh();
    } catch {
      toast.error("Invalid ID or PIN.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="id" className={authLabelClass}>
          Student or staff ID
        </label>
        <input
          id="id"
          inputMode="numeric"
          placeholder="e.g. 11287773"
          autoComplete="username"
          aria-invalid={!!errors.id}
          aria-describedby={errors.id ? "id-error" : undefined}
          className={authInputClass}
          {...form.register("id")}
        />
        <AuthFieldError id="id-error" message={errors.id?.message} />
      </div>
      <div className="space-y-2">
        <label htmlFor="pin" className={authLabelClass}>
          PIN
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          maxLength={5}
          placeholder="5-digit PIN"
          autoComplete="current-password"
          aria-invalid={!!errors.pin}
          aria-describedby={errors.pin ? "pin-error" : undefined}
          className={authInputClass}
          {...form.register("pin")}
        />
        <AuthFieldError id="pin-error" message={errors.pin?.message} />
      </div>
      <button type="submit" className={`${authButtonClass} mt-2`} disabled={login.isPending} aria-busy={login.isPending}>
        <LockKeyhole className="h-4 w-4" aria-hidden="true" />
        {login.isPending ? "Signing in..." : "Sign in"}
      </button>
      <p className="pt-2 text-center">
        <Link href="/forgot-password" className={authLinkClass}>
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}
