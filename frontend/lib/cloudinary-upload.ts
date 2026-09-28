import type { UploadSignature } from "@/types/api";
import { api } from "./api";

export async function getUploadSignature(): Promise<UploadSignature> {
  const response = await api.post("/uploads/signature");
  return response.data;
}

async function compressImage(file: File): Promise<File> {
  const sizeThreshold = 512 * 1024;
  if (file.size <= sizeThreshold) return file;

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;
  const max = 1280;

  if (width > max || height > max) {
    const scale = Math.min(max / width, max / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const testCanvas = document.createElement("canvas");
  testCanvas.width = 1;
  testCanvas.height = 1;
  const supportsWebp = testCanvas
    .toDataURL("image/webp", 0.1)
    .startsWith("data:image/webp");

  const outputType = supportsWebp ? "image/webp" : "image/jpeg";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed"));
          return;
        }
        const finalType = blob.type || outputType;
        const extension =
          finalType === "image/webp" ? ".webp" : finalType === "image/png" ? ".png" : ".jpg";
        const outName = file.name.replace(/\.[^.]+$/, "") + extension;
        resolve(new File([blob], outName, { type: finalType }));
      },
      outputType,
      0.75,
    );
  });
}

export async function uploadImageToCloudinary(
  file: File,
  signature: UploadSignature,
): Promise<string> {
  const compressed = await compressImage(file);
  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  const data = await response.json();
  return data.secure_url as string;
}
