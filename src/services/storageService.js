import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../config/firebase';

// ── Validation ───────────────────────────────────────────────
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
const ALLOWED_CHART_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

function validateFile(file, allowedTypes) {
  if (!file) throw new Error('No file provided');
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Got ${(file.size / (1024 * 1024)).toFixed(2)}MB.`
    );
  }
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type "${file.type}". Allowed: ${allowedTypes.join(', ')}`
    );
  }
}

// ── Upload helpers ───────────────────────────────────────────

/**
 * Upload a progress photo for a user.
 * @param {string} userId
 * @param {File} file
 * @param {function} [onProgress] - optional callback (0-100)
 * @returns {Promise<string>} download URL
 */
export async function uploadProgressPhoto(userId, file, onProgress) {
  validateFile(file, ALLOWED_IMAGE_TYPES);

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `users/${userId}/progress-photos/${timestamp}_${safeName}`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: { uploadedBy: userId, category: 'progress-photo' },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(pct));
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Upload a trading chart screenshot for a user.
 * @param {string} userId
 * @param {File} file
 * @param {function} [onProgress] - optional callback (0-100)
 * @returns {Promise<string>} download URL
 */
export async function uploadTradingChart(userId, file, onProgress) {
  validateFile(file, ALLOWED_CHART_TYPES);

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `users/${userId}/trading-charts/${timestamp}_${safeName}`;
  const storageRef = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: { uploadedBy: userId, category: 'trading-chart' },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(pct));
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Delete a file from Firebase Storage by its full path.
 * @param {string} path - storage path (e.g. 'users/xyz/progress-photos/abc.jpg')
 */
export async function deleteFile(path) {
  if (!path) throw new Error('No path provided');
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
