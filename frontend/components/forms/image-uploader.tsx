"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "cn";
import { getUploadSignature, uploadImageToCloudinary } from "@/lib/cloudinary-upload";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ value, onChange, maxFiles = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  async function handleFiles(files: FileList | null) {
    if (!files) return;

    const accepted = Array.from(files).slice(0, maxFiles - value.length);
    if (accepted.length === 0) return;

    const images = accepted.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) {
      setUploading(false);
      setProgress({});
      return;
    }

    setUploading(true);

    try {
      const signature = await getUploadSignature();
      const newUrls = await Promise.all(
        images.map(async (file) => {
          setProgress((prev) => ({ ...prev, [file.name]: 25 }));
          const url = await uploadImageToCloudinary(file, signature);
          setProgress((prev) => ({ ...prev, [file.name]: 100 }));
          return url;
        }),
      );

      onChange([...value, ...newUrls]);
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setUploading(false);
      setProgress({});
    }
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            <img
              src={url}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {value.length < maxFiles && (
          <label
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-4 text-center transition-colors hover:bg-accent",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {uploading ? "Uploading..." : "Upload image"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
            {Object.keys(progress).map((name) => (
              <span key={name} className="text-xs text-muted-foreground">
                {name}: {progress[name]}%
              </span>
            ))}
          </label>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        <ImageIcon className="mr-1 inline h-3 w-3" />
        Upload up to {maxFiles} images. Only image files are allowed.
      </p>
    </div>
  );
}
