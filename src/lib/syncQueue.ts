import { isOnline } from './offline';

const DB_NAME = 'lumenDB';
const DB_VERSION = 1;
const STORE_NAME = 'syncQueue';

export interface SyncQueueItem {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  type: string;
  description: string;
  tag: string;
  retryCount: number;
  maxRetries: number;
  synced: boolean;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });

        objectStore.createIndex('tag', 'tag', { unique: false });
        objectStore.createIndex('synced', 'synced', { unique: false });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

export async function addToSyncQueue(
  item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'synced'>
): Promise<number> {
  const db = await openDatabase();

  const queueItem: Omit<SyncQueueItem, 'id'> = {
    ...item,
    timestamp: Date.now(),
    retryCount: 0,
    maxRetries: item.maxRetries || 3,
    synced: false,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(queueItem);

    request.onsuccess = () => {
      resolve(request.result as number);

      if (isOnline()) {
        registerBackgroundSync(item.tag);
      }
    };
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

export async function getSyncQueue(filter?: {
  synced?: boolean;
  tag?: string;
}): Promise<SyncQueueItem[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      let items = request.result as SyncQueueItem[];

      if (filter?.synced !== undefined) {
        items = items.filter(item => item.synced === filter.synced);
      }

      if (filter?.tag) {
        items = items.filter(item => item.tag === filter.tag);
      }

      resolve(items);
    };
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

export async function updateSyncQueueItem(
  id: number,
  updates: Partial<SyncQueueItem>
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (!item) {
        reject(new Error('Item not found'));
        return;
      }

      const updatedItem = { ...item, ...updates };
      const putRequest = store.put(updatedItem);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);

    transaction.oncomplete = () => db.close();
  });
}

export async function removeSyncQueueItem(id: number): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

export async function clearSyncQueue(onlySynced: boolean = true): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    if (onlySynced) {
      const index = store.index('synced');
      const request = index.openCursor(IDBKeyRange.only(true));

      request.onsuccess = event => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    } else {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    }

    transaction.oncomplete = () => db.close();
  });
}

export async function processSyncQueue(): Promise<void> {
  if (!isOnline()) {
    console.log('[SyncQueue] Offline, skipping sync');
    return;
  }

  const queue = await getSyncQueue({ synced: false });

  for (const item of queue) {
    if (item.retryCount >= item.maxRetries) {
      console.error('[SyncQueue] Max retries reached for item:', item.id);
      continue;
    }

    try {
      const fetchOptions: RequestInit = {
        method: item.method,
        headers: item.headers,
      };
      if (item.body) {
        fetchOptions.body = item.body;
      }
      const response = await fetch(item.url, fetchOptions);

      if (response.ok) {
        await updateSyncQueueItem(item.id!, { synced: true });
        console.log('[SyncQueue] Successfully synced item:', item.id);
      } else {
        await updateSyncQueueItem(item.id!, {
          retryCount: item.retryCount + 1,
        });
        console.error('[SyncQueue] Failed to sync item:', item.id, response.status);
      }
    } catch (error) {
      await updateSyncQueueItem(item.id!, {
        retryCount: item.retryCount + 1,
      });
      console.error('[SyncQueue] Error syncing item:', item.id, error);
    }
  }
}

async function registerBackgroundSync(tag: string): Promise<void> {
  if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(`sync-${tag}`);
      console.log('[SyncQueue] Background sync registered:', tag);
    } catch (error) {
      console.error('[SyncQueue] Failed to register background sync:', error);
    }
  }
}

export async function queueApiRequest(
  url: string,
  method: string,
  data?: any,
  description?: string
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const queueItem: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'synced'> = {
    url,
    method,
    headers,
    body: data ? JSON.stringify(data) : '',
    type: 'api',
    description: description || `${method} ${url}`,
    tag: `api-${Date.now()}`,
    maxRetries: 3,
  };

  await addToSyncQueue(queueItem);
}

export function initializeSyncQueue(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('[SyncQueue] Online, processing queue...');
    processSyncQueue();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data?.type === 'SYNC_COMPLETE') {
        console.log('[SyncQueue] Sync complete from service worker');
        processSyncQueue();
      }
    });
  }

  if (isOnline()) {
    processSyncQueue();
  }
}

export async function getPendingSyncCount(): Promise<number> {
  const items = await getSyncQueue({ synced: false });
  return items.length;
}

export async function getLastSyncTime(): Promise<Date | null> {
  const items = await getSyncQueue({ synced: true });
  if (items.length === 0) return null;

  const sorted = items.sort((a, b) => b.timestamp - a.timestamp);
  const lastItem = sorted[0];
  return lastItem ? new Date(lastItem.timestamp) : null;
}
