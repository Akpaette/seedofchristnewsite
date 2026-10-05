export const TESTIMONY_CATEGORIES = [
  "Healing",
  "Deliverance",
  "Salvation",
  "Answered Prayer",
  "Provision",
  "Restoration",
  "Family",
  "Career / Business",
  "Other",
] as const;

export const AUDIO_MAX_BYTES = 10 * 1024 * 1024;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

/** MIME type → safe storage extension. Anything else is rejected. */
export const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};
export const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
export const AUDIO_ACCEPT = ".mp3,.m4a,.aac,.wav,.ogg,.webm," + Object.keys(AUDIO_TYPES).join(",");
export const PHOTO_ACCEPT = ".jpg,.jpeg,.png,.webp," + Object.keys(PHOTO_TYPES).join(",");

/** Redraws a photo on a canvas: strips EXIF/GPS metadata and downsizes to ≤1600px JPEG. */
export async function sanitizePhoto(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("This photo could not be processed.");
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}
