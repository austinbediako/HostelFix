"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormTextarea } from "./form-textarea";
import { FormSelect } from "./form-select";
import { FormRadioGroup } from "./form-radio-group";
import { ImageUploader } from "./image-uploader";
import { ISSUE_CATEGORIES } from "@/constants/issue-categories";
import { ISSUE_PRIORITIES } from "@/constants/priorities";
import { useHalls } from "@/hooks/use-halls";
import { LoadingState } from "@/components/shared/loading-state";
import type { Hall } from "@/types/hall";

const issueSchema = z.object({
  hallId: z.string().min(1, "Select a hall"),
  room: z.string().min(1, "Enter your room number").max(20, "Room number is too long"),
  category: z.enum(["plumbing", "electrical", "sanitation", "internet", "structural", "other"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  reportedPriority: z.enum(["emergency", "high", "normal", "low"]),
  imageUrls: z.array(z.string().url()).max(5),
});

export type IssueFormData = z.infer<typeof issueSchema>;

interface IssueFormProps {
  onSubmit: (data: IssueFormData) => void;
  isSubmitting?: boolean;
}

export function IssueForm({ onSubmit, isSubmitting }: IssueFormProps) {
  const { data: halls, isLoading: hallsLoading } = useHalls();
  const form = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      hallId: "",
      room: "",
      category: "other",
      description: "",
      reportedPriority: "normal",
      imageUrls: [],
    },
  });

  const selectedHallId = useWatch({ control: form.control, name: "hallId" });
  const imageUrls = useWatch({ control: form.control, name: "imageUrls" });
  const category = useWatch({ control: form.control, name: "category" });
  const priority = useWatch({ control: form.control, name: "reportedPriority" });
  const room = useWatch({ control: form.control, name: "room" });
  const description = useWatch({ control: form.control, name: "description" });

  const hallOptions =
    halls?.map((hall: Hall) => ({ value: hall.id, label: hall.name })) ?? [];

  const selectedHall = halls?.find((hall: Hall) => hall.id === selectedHallId);

  if (hallsLoading) {
    return <LoadingState message="Loading halls..." />;
  }

  const categoryLabel = ISSUE_CATEGORIES.find((c) => c.value === category)?.label ?? category;
  const priorityLabel = ISSUE_PRIORITIES.find((p) => p.value === priority)?.label ?? priority;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-6">
          <section className="relative overflow-hidden border border-border/50 bg-card p-6 shadow-sm sm:p-8 transition-all hover:border-border hover:shadow-md">
            <div className="absolute left-0 top-0 h-1 w-full bg-primary/20" />
            <div className="mb-6 flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex h-8 w-8 items-center justify-center bg-primary-tint/50 font-bold text-primary">1</div>
              <h2 className="text-lg font-semibold text-foreground">What is the problem?</h2>
            </div>
            <div className="space-y-5">
              <FormSelect
                name="category"
                label="Category"
                placeholder="Select a category"
                options={ISSUE_CATEGORIES}
              />
              <FormTextarea
                name="description"
                label="Description"
                placeholder="Describe the maintenance issue in detail..."
              />
            </div>
          </section>

          <section className="relative overflow-hidden border border-border/50 bg-card p-6 shadow-sm sm:p-8 transition-all hover:border-border hover:shadow-md">
            <div className="absolute left-0 top-0 h-1 w-full bg-primary/20" />
            <div className="mb-6 flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex h-8 w-8 items-center justify-center bg-primary-tint/50 font-bold text-primary">2</div>
              <h2 className="text-lg font-semibold text-foreground">Where is it?</h2>
            </div>
            <div className="space-y-5">
              <FormSelect
                name="hallId"
                label="Hall"
                placeholder="Search or select a hall"
                options={hallOptions}
                searchable
              />
              <div className="space-y-2">
                <Label htmlFor="room" className="font-medium text-foreground">Room number</Label>
                <Input
                  id="room"
                  placeholder={
                    selectedHall?.type === "ugel"
                      ? "e.g. 3215"
                      : selectedHall?.code === "VOL"
                        ? "e.g. 12"
                        : "e.g. C310"
                  }
                  autoComplete="off"
                  className="bg-background shadow-sm"
                  {...form.register("room")}
                />
                {form.formState.errors.room && (
                  <p className="text-sm text-destructive">{form.formState.errors.room.message}</p>
                )}
                {selectedHall && (
                  <p className="text-xs text-muted-foreground bg-primary-tint/20 p-2 border-l-2 border-primary/40 mt-1">
                    {selectedHall.type === "ugel"
                      ? "UGEL halls: 4 digits, e.g. 3215 (Block 3, Floor 2, Room 15)"
                      : selectedHall.code === "VOL"
                        ? "Volta Hall: 1-3 digit room number"
                        : "Traditional halls: block letter + floor + room, e.g. C310"}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden border border-border/50 bg-card p-6 shadow-sm sm:p-8 transition-all hover:border-border hover:shadow-md">
            <div className="absolute left-0 top-0 h-1 w-full bg-primary/20" />
            <div className="mb-6 flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex h-8 w-8 items-center justify-center bg-primary-tint/50 font-bold text-primary">3</div>
              <h2 className="text-lg font-semibold text-foreground">Supporting details</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Photos (optional)</label>
                <div className="rounded-none border border-dashed border-border/60 bg-background/50 p-1">
                  <ImageUploader
                    value={imageUrls}
                    onChange={(urls) => form.setValue("imageUrls", urls, { shouldValidate: true })}
                  />
                </div>
              </div>
              <div className="pt-2">
                <FormRadioGroup
                  name="reportedPriority"
                  label="How urgent is it?"
                  options={ISSUE_PRIORITIES}
                />
              </div>
              {priority === "emergency" && (
                <p className="flex items-start gap-2 border-l-4 border-l-danger bg-danger-bg p-3 text-sm text-danger shadow-sm">
                  <span className="font-bold shrink-0">!</span>
                  <span>For emergencies, also contact your hall porter or hall management directly — do not wait for this report to be processed.</span>
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="relative overflow-hidden border-t-4 border-t-accent bg-secondary/30 p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Review your report</h2>
          </div>
          <dl className="grid gap-x-4 gap-y-4 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</dt>
              <dd className="font-medium text-foreground">{categoryLabel}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Priority</dt>
              <dd className="font-medium text-foreground">{priorityLabel}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</dt>
              <dd className="font-medium text-foreground">{selectedHall ? `${selectedHall.name}${room ? `, Room ${room}` : ""}` : "Not selected"}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Photos</dt>
              <dd className="font-medium text-foreground">{imageUrls.length > 0 ? `${imageUrls.length} attached` : "None"}</dd>
            </div>
            <div className="space-y-1 sm:col-span-2 pt-2 border-t border-border/40">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Description</dt>
              <dd className="text-foreground/80 leading-relaxed bg-background/50 p-3 border border-border/30 rounded-sm">{description || "—"}</dd>
            </div>
          </dl>
        </section>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full shadow-sm transition-all hover:-translate-y-0.5 sm:w-auto px-8 text-base">
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
