"use client";

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SessionExpiredModal from '@/app/components/SessionExpiredModal';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { handleExpiration, isExpired, logout } = useAuth();

  useEffect(() => {
    const checkExpiration = () => {
      handleExpiration();
    };

    // Check every 30 seconds
    const interval = setInterval(checkExpiration, 30000);

    // Initial check
    checkExpiration();

    return () => clearInterval(interval);
  }, [handleExpiration]);

  return (
    <>
      {children}
      <SessionExpiredModal isOpen={isExpired} onClose={logout} />
    </>
  );
}
