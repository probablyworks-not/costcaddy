// B4 / ADR-0002: photos are compressed and EXIF-normalised client-side before upload.
// Decoding through createImageBitmap with `imageOrientation: 'from-image'` bakes the
// EXIF orientation into the pixels once, then a canvas re-encode drops the EXIF block
// entirely (canvas exports never carry it) — so what reaches the server is already
// upright and stripped of metadata. Non-image files (pdf/csv/xlsx) pass through as-is.
export async function compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}
