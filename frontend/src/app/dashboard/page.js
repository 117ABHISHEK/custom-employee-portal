'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, logout } from '@/utils/auth';

const ZOHO_APPS = [
  { permission: 'access:zoho_people', label: 'Zoho People', apiPath: '/zoho/people', externalUrl: 'https://people.zoho.in' },
  { permission: 'access:zoho_crm', label: 'Zoho CRM', apiPath: '/zoho/crm', externalUrl: 'https://crm.zoho.in' },
  { permission: 'access:zoho_desk', label: 'Zoho Desk', apiPath: '/zoho/desk', externalUrl: 'https://desk.zoho.in' },
  { permission: 'access:zoho_books', label: 'Zoho Books', apiPath: '/zoho/books', externalUrl: 'https://books.zoho.in' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState(() => (typeof window !== 'undefined' ? getUser() : null));

  if (typeof window !== 'undefined' && !isAuthenticated()) {
    router.replace('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const authorizedApps = ZOHO_APPS.filter((app) => user.permissions.includes(app.permission));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">BrainWave Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user.name} <span className="text-gray-400">({user.role})</span>
          </span>
          {user.role === 'Admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="text-sm text-blue-600 hover:underline"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-lg font-medium text-gray-700 mb-6">Your Authorized Applications</h2>

        {authorizedApps.length === 0 ? (
          <p className="text-gray-500">No Zoho applications assigned to your role yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {authorizedApps.map((app) => (
              <a
                key={app.permission}
                href={app.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition text-center"
              >
                <div className="text-lg font-medium text-gray-800">{app.label}</div>
                <div className="text-xs text-gray-400 mt-1">Click to open</div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}