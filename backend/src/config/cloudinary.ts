import { v2 as cloudinary } from 'cloudinary';
import { env } from './environment.js';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true,
});

export { cloudinary };

export interface UploadSignaturePayload {
  timestamp: number;
  signature: string;
  apiKey: string;
  folder: string;
  cloudName: string;
}

export function generateUploadSignature(folder?: string): UploadSignaturePayload {
  const resolvedFolder = folder ?? env.cloudinaryFolder;
  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, string> = {
    timestamp: String(timestamp),
    folder: resolvedFolder,
  };
  const signature = cloudinary.utils.api_sign_request(params, env.cloudinaryApiSecret);

  return {
    timestamp,
    signature,
    apiKey: env.cloudinaryApiKey,
    folder: resolvedFolder,
    cloudName: env.cloudinaryCloudName,
  };
}

/**
 * Extract the public_id from a Cloudinary secure_url.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v123/hostelfix/123/unsorted/abc.jpg"
 *   → "hostelfix/123/unsorted/abc"
 */
export function extractPublicId(secureUrl: string): string {
  const parsed = new URL(secureUrl);
  // pathname: /cloud_name/image/upload/v123456/folder/subfolder/filename.ext
  const parts = parsed.pathname.split('/image/upload/');
  if (parts.length < 2) throw new Error(`Cannot extract public_id from: ${secureUrl}`);
  // Remove the version segment (v123456) and file extension
  const afterUpload = parts[1].replace(/^v\d+\//, '');
  return afterUpload.replace(/\.[^/.]+$/, '');
}

/**
 * Move a Cloudinary image from one folder to another by renaming its public_id.
 * Returns the new secure_url.
 */
export async function moveCloudinaryAsset(
  currentPublicId: string,
  newPublicId: string,
): Promise<string> {
  const result = await cloudinary.uploader.rename(currentPublicId, newPublicId, {
    overwrite: false,
    invalidate: true,
  });
  return result.secure_url as string;
}

/**
 * Move multiple image URLs from their current folder to a target folder.
 * Returns the array of new secure_urls in the same order.
 */
export async function moveImagesToFolder(
  imageUrls: string[],
  targetFolder: string,
): Promise<string[]> {
  if (imageUrls.length === 0) return [];

  const newUrls: string[] = [];
  for (const url of imageUrls) {
    const currentId = extractPublicId(url);
    const filename = currentId.split('/').pop()!;
    const newId = `${targetFolder}/${filename}`;
    const newUrl = await moveCloudinaryAsset(currentId, newId);
    newUrls.push(newUrl);
  }
  return newUrls;
}

export function isCloudinaryImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    const allowedHostnames = [
      'res.cloudinary.com',
      `${env.cloudinaryCloudName}.cloudinary.com`,
      `res-${env.cloudinaryCloudName}.cloudinary.com`,
    ];
    const isImageUpload = parsed.pathname.includes('/image/upload/');
    return isImageUpload && allowedHostnames.some((hostname) => parsed.hostname.endsWith(hostname));
  } catch {
    return false;
  }
}
