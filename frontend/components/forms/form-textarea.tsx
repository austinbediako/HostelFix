"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
}

export function FormTextarea({ name, label, placeholder }: FormTextareaProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[name];

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea id={name} placeholder={placeholder} {...register(name)} />
      {error?.message && (
        <p className="text-sm text-destructive">{String(error.message)}</p>
      )}
    </div>
  );
}
