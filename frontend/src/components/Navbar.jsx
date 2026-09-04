'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, logout } from '@/utils/auth';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('theme') || 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  localStorage.setItem('theme', theme);
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setUser(getUser());
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-text-primary">BrainWave</span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user.role === 'Admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="text-xs font-medium px-3 py-1.5 rounded-md text-primary bg-primary-light hover:opacity-80 transition-colors"
            >
              Admin
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-secondary hover:bg-border/50 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <span className="text-xs font-medium text-text-secondary hidden sm:inline">{user.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-danger hover:bg-danger-light transition-colors"
            aria-label="Sign out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
