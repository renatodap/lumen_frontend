'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getSyncQueue, clearSyncQueue } from '@/lib/syncQueue';

interface SyncItem {
  id: string;
  timestamp: Date;
  type: string;
  description: string;
  status: 'pending' | 'syncing' | 'success' | 'error';
  retryCount?: number;
}

interface SyncStatusProps {
  className?: string;
  autoSync?: boolean;
}

export default function SyncStatus({ className = '', autoSync = true }: SyncStatusProps) {
  const [syncItems, setSyncItems] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadSyncQueue();

    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (online && autoSync && syncItems.length > 0) {
        syncAll();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const handleSyncMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_COMPLETE') {
        loadSyncQueue();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleSyncMessage);

    const interval = setInterval(loadSyncQueue, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      navigator.serviceWorker?.removeEventListener('message', handleSyncMessage);
      clearInterval(interval);
    };
  }, [autoSync, syncItems.length]);

  const loadSyncQueue = async () => {
    try {
      const queue = await getSyncQueue();
      setSyncItems(
        queue.map(item => ({
          id: item.id?.toString() || '',
          timestamp: new Date(item.timestamp),
          type: item.type,
          description: item.description,
          status: item.synced ? 'success' : 'pending',
          retryCount: item.retryCount,
        }))
      );
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  };

  const syncAll = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);

    try {
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('sync-all');
      }

      await loadSyncQueue();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const clearCompleted = async () => {
    try {
      const pendingItems = syncItems.filter(item => item.status !== 'success');
      await clearSyncQueue();
      setSyncItems(pendingItems);
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
    }
  };

  const getPendingCount = () => syncItems.filter(item => item.status === 'pending').length;
  const getSuccessCount = () => syncItems.filter(item => item.status === 'success').length;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (syncItems.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
      {/* Compact indicator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-3 flex items-center gap-3 w-full hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-colors"
        >
          <div className="relative">
            {isSyncing ? (
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            ) : getPendingCount() > 0 ? (
              <Clock className="w-5 h-5 text-yellow-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {getPendingCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {getPendingCount()}
              </span>
            )}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isSyncing ? 'Syncing...' : getPendingCount() > 0 ? 'Pending sync' : 'All synced'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getPendingCount()} pending • {getSuccessCount()} synced
            </p>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded view */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Sync Queue</h3>
              <div className="flex gap-2">
                <button
                  onClick={syncAll}
                  disabled={!isOnline || isSyncing || getPendingCount() === 0}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Now
                </button>
                {getSuccessCount() > 0 && (
                  <button
                    onClick={clearCompleted}
                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {syncItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 p-2 rounded bg-gray-50 dark:bg-gray-750"
                >
                  {item.status === 'pending' && (
                    <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  {item.status === 'syncing' && (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin mt-0.5 flex-shrink-0" />
                  )}
                  {item.status === 'success' && (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  {item.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type} • {formatTimestamp(item.timestamp)}
                      {item.retryCount && item.retryCount > 0 && ` • ${item.retryCount} retries`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {!isOnline && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                You're offline. Items will sync automatically when connection is restored.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
