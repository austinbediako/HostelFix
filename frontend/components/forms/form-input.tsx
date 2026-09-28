"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
}

export function FormInput({ name, label, type = "text", placeholder }: FormInputProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[name];

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input id={name} type={type} placeholder={placeholder} {...register(name)} />
      {error?.message && (
        <p className="text-sm text-destructive">{String(error.message)}</p>
      )}
    </div>
  );
}
