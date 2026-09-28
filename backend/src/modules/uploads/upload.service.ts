import type { Express } from 'express';
import { generateUploadSignature, type UploadSignaturePayload } from '../../config/cloudinary.js';
import { env } from '../../config/environment.js';

/**
 * Generate a signed upload preset for the authenticated user.
 * Images land in `HostelFix/{userId}/unsorted/` initially.
 * After issue creation the backend moves them into the final
 * `HostelFix/{userId}/{referenceNumber}/` folder.
 */
export function createUploadSignature(user: Express.User): UploadSignaturePayload {
  const userId = user.studentId ?? user.staffId ?? user._id.toString();
  const folder = `${env.cloudinaryFolder}/${userId}/unsorted`;
  return generateUploadSignature(folder);
}
