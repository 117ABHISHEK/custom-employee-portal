'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, isAuthenticated } from '@/utils/auth';

export default function ProtectedRoute({ children, requiredPermission = null }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
    setUser(getUser());
    setMounted(true);
  }, [router]);

  // Server render + first client render both show nothing — avoids hydration mismatch
  if (!mounted || !user) return null;

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-500">You don&apos;t have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}