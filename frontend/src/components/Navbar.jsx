'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, logout } from '@/utils/auth';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1
        className="text-xl font-semibold text-gray-800 cursor-pointer"
        onClick={() => router.push('/dashboard')}
      >
        BrainWave Portal
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user.name} <span className="text-gray-400">({user.role})</span>
        </span>
        {user.role === 'Admin' && (
          <button onClick={() => router.push('/admin')} className="text-sm text-blue-600 hover:underline">
            Admin Panel
          </button>
        )}
        <button onClick={handleLogout} className="text-sm bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300">
          Logout
        </button>
      </div>
    </nav>
  );
}