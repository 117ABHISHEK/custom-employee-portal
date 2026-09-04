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

  if (!mounted || !user) return null;

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-danger-light mb-4">
            <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-text-primary mb-1">Access Denied</h2>
          <p className="text-sm text-text-muted mb-4">You don&apos;t have permission to view this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
}
