export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

export function onOnline(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('online', callback);
  return () => window.removeEventListener('online', callback);
}

export function onOffline(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('offline', callback);
  return () => window.removeEventListener('offline', callback);
}

export function getNetworkStatus(): {
  online: boolean;
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
} {
  if (typeof navigator === 'undefined') {
    return { online: true };
  }

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  return {
    online: navigator.onLine,
    type: connection?.type,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  };
}

export async function waitForOnline(timeout?: number): Promise<boolean> {
  if (isOnline()) return true;

  return new Promise(resolve => {
    const onlineHandler = () => {
      cleanup();
      resolve(true);
    };

    const timeoutHandler = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeout || 30000);

    const cleanup = () => {
      window.removeEventListener('online', onlineHandler);
      clearTimeout(timeoutHandler);
    };

    window.addEventListener('online', onlineHandler);
  });
}

export function checkServerConnection(url: string = '/api/health'): Promise<boolean> {
  return fetch(url, {
    method: 'HEAD',
    cache: 'no-cache',
  })
    .then(response => response.ok)
    .catch(() => false);
}

export class OnlineStatusManager {
  private listeners: Set<(online: boolean) => void> = new Set();
  private _isOnline: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this._isOnline = navigator.onLine;
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this._isOnline = true;
    this.notifyListeners(true);
  };

  private handleOffline = () => {
    this._isOnline = false;
    this.notifyListeners(false);
  };

  private notifyListeners(online: boolean) {
    this.listeners.forEach(listener => listener(online));
  }

  public subscribe(callback: (online: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this._isOnline);

    return () => {
      this.listeners.delete(callback);
    };
  }

  public get isOnline(): boolean {
    return this._isOnline;
  }

  public destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    this.listeners.clear();
  }
}

export const onlineStatusManager = new OnlineStatusManager();

export async function fetchWithOfflineFallback<T>(
  url: string,
  options?: RequestInit,
  fallbackData?: T
): Promise<T> {
  if (!isOnline()) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw new Error('Offline and no fallback data provided');
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

export function getOfflineCapabilities() {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    indexedDB: 'indexedDB' in window,
    localStorage: typeof localStorage !== 'undefined',
    backgroundSync: 'serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype,
    pushNotifications: 'serviceWorker' in navigator && 'PushManager' in window,
    periodicSync:
      'serviceWorker' in navigator && 'periodicSync' in ServiceWorkerRegistration.prototype,
  };
}

export function estimateStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    return navigator.storage.estimate().then(estimate => ({
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0,
    }));
  }
  return Promise.resolve({ usage: 0, quota: 0, percentage: 0 });
}

export async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    const isPersisted = await navigator.storage.persist();
    return isPersisted;
  }
  return false;
}

export async function isPersistentStorageGranted(): Promise<boolean> {
  if ('storage' in navigator && 'persisted' in navigator.storage) {
    return await navigator.storage.persisted();
  }
  return false;
}
