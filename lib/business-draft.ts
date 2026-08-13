const DB_NAME = "giovafilm-add-business";
const DB_VERSION = 1;
const STORE = "drafts";
export const ADD_BUSINESS_DRAFT_KEY = "user-add-business";

export type StoredFile = {
  name: string;
  type: string;
  lastModified: number;
  data: ArrayBuffer;
};

export type BusinessDraft = {
  step: number;
  maxReachedStep: number;
  values: Record<string, any>;
  photos: StoredFile[];
  menu: StoredFile | null;
  offerPhoto: StoredFile | null;
  savedAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function fileToStored(file: File): Promise<StoredFile> {
  return {
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    data: await file.arrayBuffer(),
  };
}

export function storedToFile(stored: StoredFile): File {
  return new File([stored.data], stored.name, {
    type: stored.type || "application/octet-stream",
    lastModified: stored.lastModified || Date.now(),
  });
}

export async function saveBusinessDraft(draft: BusinessDraft): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put(draft, ADD_BUSINESS_DRAFT_KEY);
  });
  db.close();
}

export async function loadBusinessDraft(): Promise<BusinessDraft | null> {
  try {
    const db = await openDb();
    const draft = await new Promise<BusinessDraft | null>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(ADD_BUSINESS_DRAFT_KEY);
      req.onsuccess = () => resolve((req.result as BusinessDraft) || null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return draft;
  } catch {
    return null;
  }
}

export async function clearBusinessDraft(): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore(STORE).delete(ADD_BUSINESS_DRAFT_KEY);
    });
    db.close();
  } catch {
    // ignore
  }
}
