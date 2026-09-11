import { ensureBucketExists, STORAGE_BUCKET } from '@/lib/storage';

ensureBucketExists()
  .then(() => console.log(`Storage bucket "${STORAGE_BUCKET}" is ready.`))
  .catch((error) => {
    console.error('Failed to set up storage bucket:', error);
    process.exit(1);
  });
