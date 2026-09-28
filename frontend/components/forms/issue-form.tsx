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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-base font-semibold">What is the problem?</h2>
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
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Where is it?</h2>
          <FormSelect
            name="hallId"
            label="Hall"
            placeholder="Search or select a hall"
            options={hallOptions}
            searchable
          />
          <div className="space-y-2">
            <Label htmlFor="room">Room number</Label>
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
              {...form.register("room")}
            />
            {form.formState.errors.room && (
              <p className="text-sm text-destructive">{form.formState.errors.room.message}</p>
            )}
            {selectedHall && (
              <p className="text-xs text-muted-foreground">
                {selectedHall.type === "ugel"
                  ? "UGEL halls: 4 digits, e.g. 3215 (Block 3, Floor 2, Room 15)"
                  : selectedHall.code === "VOL"
                    ? "Volta Hall: 1-3 digit room number"
                    : "Traditional halls: block letter + floor + room, e.g. C310"}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold">Supporting details</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Photos (optional)</label>
            <ImageUploader
              value={imageUrls}
              onChange={(urls) => form.setValue("imageUrls", urls, { shouldValidate: true })}
            />
          </div>
          <FormRadioGroup
            name="reportedPriority"
            label="How urgent is it?"
            options={ISSUE_PRIORITIES}
          />
          {priority === "emergency" && (
            <p className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">
              For emergencies, also contact your hall porter or hall management
              directly — do not wait for this report to be processed.
            </p>
          )}
        </section>

        <section className="space-y-3 rounded-md border border-border bg-secondary/50 p-4">
          <h2 className="text-base font-semibold">Review your report</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Category</dt>
              <dd>{categoryLabel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Priority</dt>
              <dd>{priorityLabel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd>{selectedHall ? `${selectedHall.name}${room ? `, Room ${room}` : ""}` : "Not selected"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Photos</dt>
              <dd>{imageUrls.length > 0 ? `${imageUrls.length} attached` : "None"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="line-clamp-3">{description || "—"}</dd>
            </div>
          </dl>
        </section>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Submitting..." : "Submit Issue"}
        </Button>
      </form>
    </FormProvider>
  );
}
