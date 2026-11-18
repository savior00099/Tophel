import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { openDB } from 'idb';
import { IDB_CONFIG } from '../config/constants';

// ── IndexedDB setup ──────────────────────────────────────────

async function getIDB() {
  return openDB(IDB_CONFIG.DB_NAME, IDB_CONFIG.DB_VERSION, {
    upgrade(database) {
      for (const storeName of Object.values(IDB_CONFIG.STORES)) {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: 'id' });
        }
      }
    },
  });
}

/**
 * Cache data locally in IndexedDB for offline use.
 */
export async function cacheLocally(storeName, id, data) {
  const idb = await getIDB();
  await idb.put(storeName, { id, data, cachedAt: new Date().toISOString() });
}

/**
 * Read cached data from IndexedDB.
 */
export async function readCache(storeName, id) {
  const idb = await getIDB();
  const record = await idb.get(storeName, id);
  return record?.data ?? null;
}

/**
 * Clear a specific store in IndexedDB.
 */
export async function clearCache(storeName) {
  const idb = await getIDB();
  await idb.clear(storeName);
}

// ── Firestore data collection helpers ────────────────────────

async function fetchSubcollection(userId, subcollectionName) {
  const colRef = collection(db, 'users', userId, subcollectionName);
  const snap = await getDocs(colRef);
  const docs = {};
  snap.forEach((docSnap) => {
    docs[docSnap.id] = docSnap.data();
  });
  return docs;
}

// ── Export ────────────────────────────────────────────────────

/**
 * Export all user data as a JSON file download.
 * Collects: profile, sectors, dailyLogs, tradingJournal.
 * @param {string} userId
 */
export async function exportAllDataAsJSON(userId) {
  if (!userId) throw new Error('userId is required for export');

  // Gather all user data from Firestore
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);
  const profile = userDocSnap.exists() ? userDocSnap.data() : {};

  const [sectors, dailyLogs, tradingJournal] = await Promise.all([
    fetchSubcollection(userId, 'sectors'),
    fetchSubcollection(userId, 'dailyLogs'),
    fetchSubcollection(userId, 'tradingJournal'),
  ]);

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    userId,
    profile,
    sectors,
    dailyLogs,
    tradingJournal,
  };

  // Convert Firestore Timestamps to ISO strings for portability
  const jsonString = JSON.stringify(exportData, (key, value) => {
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      return new Date(value.seconds * 1000).toISOString();
    }
    return value;
  }, 2);

  // Trigger browser download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hitmark-backup-${userId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Also cache locally
  await cacheLocally(IDB_CONFIG.STORES.USER, `backup-${userId}`, exportData);

  return exportData;
}

// ── Import ───────────────────────────────────────────────────

/**
 * Restore user data from a JSON backup.
 * @param {string} userId - must match logged-in user
 * @param {object|string} jsonData - parsed object or JSON string
 */
export async function importDataFromJSON(userId, jsonData) {
  if (!userId) throw new Error('userId is required for import');

  const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

  if (!data || data.version === undefined) {
    throw new Error('Invalid backup file: missing version field');
  }

  // Security: prevent importing another user's data
  if (data.userId && data.userId !== userId) {
    throw new Error('Backup belongs to a different user. Import denied.');
  }

  const batch = writeBatch(db);

  // Restore profile
  if (data.profile) {
    const userDocRef = doc(db, 'users', userId);
    batch.set(userDocRef, {
      ...data.profile,
      lastLogin: serverTimestamp(),
      restoredAt: serverTimestamp(),
    }, { merge: true });
  }

  // Restore sectors
  if (data.sectors) {
    for (const [sectorId, sectorData] of Object.entries(data.sectors)) {
      const sectorRef = doc(db, 'users', userId, 'sectors', sectorId);
      batch.set(sectorRef, sectorData);
    }
  }

  // Restore daily logs
  if (data.dailyLogs) {
    for (const [logId, logData] of Object.entries(data.dailyLogs)) {
      const logRef = doc(db, 'users', userId, 'dailyLogs', logId);
      batch.set(logRef, logData);
    }
  }

  // Restore trading journal
  if (data.tradingJournal) {
    for (const [entryId, entryData] of Object.entries(data.tradingJournal)) {
      const entryRef = doc(db, 'users', userId, 'tradingJournal', entryId);
      batch.set(entryRef, entryData);
    }
  }

  await batch.commit();

  // Update local cache
  await cacheLocally(IDB_CONFIG.STORES.USER, `backup-${userId}`, data);

  return { success: true, restored: Object.keys(data).filter((k) => k !== 'version' && k !== 'exportedAt' && k !== 'userId') };
}
