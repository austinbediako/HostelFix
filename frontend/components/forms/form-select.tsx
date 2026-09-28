"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  searchable?: boolean;
}

export function FormSelect({ name, label, placeholder, options, searchable }: FormSelectProps) {
  const { control, formState } = useFormContext();
  const error = formState.errors[name];

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          searchable ? (
            <Combobox
              id={name}
              value={field.value}
              onValueChange={field.onChange}
              options={options}
              placeholder={placeholder}
            />
          ) : (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={name}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
      />
      {error?.message && (
        <p className="text-sm text-destructive">{String(error.message)}</p>
      )}
    </div>
  );
}
