'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';

interface OfflineIndicatorProps {
  className?: string;
  showOnlineStatus?: boolean;
}

export default function OfflineIndicator({
  className = '',
  showOnlineStatus = false,
}: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [lastOfflineTime, setLastOfflineTime] = useState<Date | null>(null);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (!online) {
        setLastOfflineTime(new Date());
        setShowNotification(true);
      } else if (lastOfflineTime) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    };

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [lastOfflineTime]);

  if (isOnline && !showOnlineStatus && !showNotification) {
    return null;
  }

  const getOfflineDuration = () => {
    if (!lastOfflineTime || isOnline) return null;
    const now = new Date();
    const diff = now.getTime() - lastOfflineTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <>
      {/* Persistent indicator */}
      {!isOnline && (
        <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
          <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
            <CloudOff className="w-4 h-4" />
            <span>You are offline</span>
            {lastOfflineTime && <span className="text-red-200">({getOfflineDuration()})</span>}
            <span className="ml-2 text-red-200">Changes will sync when you reconnect</span>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div
            className={`rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px] ${
              isOnline ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Back online</p>
                  <p className="text-sm opacity-90">Syncing your changes...</p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Connection lost</p>
                  <p className="text-sm opacity-90">You can continue working offline</p>
                </div>
              </>
            )}
            <button
              onClick={() => setShowNotification(false)}
              className="ml-2 text-white/80 hover:text-white"
              aria-label="Close notification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Minimal status icon */}
      {showOnlineStatus && (
        <div className="fixed bottom-4 left-4 z-40">
          <div
            className={`rounded-full p-2 shadow-lg ${
              isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'
            }`}
            title={isOnline ? 'Online' : 'Offline'}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>
        </div>
      )}
    </>
  );
}
