"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

interface FormRadioGroupProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
}

export function FormRadioGroup({ name, label, options }: FormRadioGroupProps) {
  const { register, formState, watch } = useFormContext();
  const selected = watch(name);
  const error = formState.errors[name];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-card text-foreground hover:bg-accent",
              )}
            >
              <input
                type="radio"
                value={option.value}
                {...register(name)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error?.message && (
        <p className="text-sm text-destructive">{String(error.message)}</p>
      )}
    </div>
  );
}
