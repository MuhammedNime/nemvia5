import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Network } from '@capacitor/network';
import { isNativeApp } from '../../lib/native';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let netHandle: { remove: () => Promise<void> } | null = null;
    if (isNativeApp()) {
      Network.getStatus()
        .then(status => setIsOnline(status.connected))
        .catch(() => {});
      Network.addListener('networkStatusChange', status => {
        setIsOnline(status.connected);
      })
        .then(h => { netHandle = h; })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (netHandle) void netHandle.remove();
    };
  }, []);

  return isOnline;
}

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 md:bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>وضع عدم الاتصال — يتم استخدام البيانات المخزنة مؤقتاً</span>
    </div>
  );
};
