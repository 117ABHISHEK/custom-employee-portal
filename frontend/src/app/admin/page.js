'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import api from '@/services/api';

const ROLES = ['Admin', 'HR', 'Sales', 'Support', 'Finance'];

export default function AdminPage() {
  return (
    <ProtectedRoute requiredPermission="manage:users">
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'HR' });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success');

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await api.get('/admin/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      const registerRes = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const userId = registerRes.data.userId;
      await api.post('/admin/assign-role', { userId, roleName: form.role });
      setStatus(`Created ${form.name} with role ${form.role}`);
      setStatusType('success');
      setForm({ name: '', email: '', password: '', role: 'HR' });
      fetchLogs();
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to create user');
      setStatusType('error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-lg font-semibold text-text-primary mb-1">Admin Panel</h1>
        <p className="text-sm text-text-muted mb-8">Manage users and review activity</p>

        {/* Create User */}
        <section className="bg-surface border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            <h2 className="text-sm font-medium text-text-primary">Create User</h2>
          </div>

          <form onSubmit={handleCreateUser}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text" placeholder="Full name" required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-border rounded-md px-3 py-2 text-sm bg-surface text-text-primary placeholder:text-text-muted input"
              />
              <input
                type="email" placeholder="Email address" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-border rounded-md px-3 py-2 text-sm bg-surface text-text-primary placeholder:text-text-muted input"
              />
              <input
                type="password" placeholder="Password" required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-border rounded-md px-3 py-2 text-sm bg-surface text-text-primary placeholder:text-text-muted input"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="border border-border rounded-md px-3 py-2 text-sm bg-surface text-text-primary input"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Create User
            </button>
          </form>

          {status && (
            <div className={`mt-3 text-sm px-3 py-2 rounded-md ${
              statusType === 'success'
                ? 'bg-success-light text-success'
                : 'bg-danger-light text-danger'
            }`}>
              {status}
            </div>
          )}
        </section>

        {/* Audit Logs */}
        <section className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h2 className="text-sm font-medium text-text-primary">Audit Logs</h2>
            </div>
            <button
              onClick={fetchLogs}
              className="text-xs font-medium px-3 py-1.5 rounded-md text-primary bg-primary-light hover:opacity-80 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loadingLogs ? (
            <LogSkeleton />
          ) : logs.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">No activity yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border">
                    <th className="pb-2 font-medium text-xs uppercase tracking-wider">User</th>
                    <th className="pb-2 font-medium text-xs uppercase tracking-wider">Action</th>
                    <th className="pb-2 font-medium text-xs uppercase tracking-wider">Target</th>
                    <th className="pb-2 font-medium text-xs uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold">
                            {(log.user?.name || 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-text-primary">{log.user?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary-light text-primary">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 text-text-muted">{log.target || '—'}</td>
                      <td className="py-2.5 text-text-muted text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
 
  );
}

function LogSkeleton() {
  return (
    <div>
      <div className="flex gap-4 pb-2 border-b border-border mb-1">
        <div className="h-2 w-12 skeleton" />
        <div className="h-2 w-12 skeleton" />
        <div className="h-2 w-12 skeleton" />
        <div className="h-2 w-12 skeleton" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2.5 border-b border-border/50">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded-full skeleton" />
            <div className="h-3 w-20 skeleton" />
          </div>
          <div className="h-4 w-14 rounded skeleton" />
          <div className="h-3 w-10 skeleton" />
          <div className="h-3 w-20 skeleton" />
        </div>
      ))}
    </div>
  );
}
