'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { getUser } from '@/utils/auth';

const ZOHO_APPS = [
  { permission: 'access:zoho_people', label: 'Zoho People', externalUrl: 'https://people.zoho.in' },
  { permission: 'access:zoho_crm', label: 'Zoho CRM', externalUrl: 'https://crm.zoho.in' },
  { permission: 'access:zoho_desk', label: 'Zoho Desk', externalUrl: 'https://desk.zoho.in' },
  { permission: 'access:zoho_books', label: 'Zoho Books', externalUrl: 'https://books.zoho.in' },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (!user) return null;

  const authorizedApps = ZOHO_APPS.filter((app) => user.permissions.includes(app.permission));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
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