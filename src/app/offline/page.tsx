'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const [, setIsOnline] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        router.push('/');
      }
    };

    checkOnline();
    window.addEventListener('online', checkOnline);

    return () => {
      window.removeEventListener('online', checkOnline);
    };
  }, [router]);

  const handleRetry = () => {
    if (navigator.onLine) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1929] to-[#1E4976] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <WifiOff className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You're Offline</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          It looks like you've lost your internet connection. Don't worry, LUMEN works offline too!
          Some features may be limited until you reconnect.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard (Offline Mode)
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            What you can do offline:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              View cached pages and content
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Create and edit tasks (will sync later)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              Read messages and documents
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              Real-time collaboration
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              Upload new files
            </li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Your changes will automatically sync when you reconnect to the internet.
        </p>
      </div>
    </div>
  );
}
