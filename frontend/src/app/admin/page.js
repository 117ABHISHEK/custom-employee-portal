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

  // Manual user creation form
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'HR' });
  const [status, setStatus] = useState('');

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

      setStatus(`Created ${form.name} and assigned role: ${form.role}`);
      setForm({ name: '', email: '', password: '', role: 'HR' });
      fetchLogs(); // refresh so the new actions show up
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-lg font-medium text-gray-700 mb-6">Admin Panel</h2>

        {/* Create user + assign role */}
        <section className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-medium text-gray-800 mb-4">Create User & Assign Role</h3>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Name" required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="email" placeholder="Email" required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="password" placeholder="Password" required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border rounded px-3 py-2"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              type="submit"
              className="sm:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Create User
            </button>
          </form>
          {status && <p className="text-sm mt-3 text-gray-600">{status}</p>}
        </section>

        {/* Audit logs */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800">Audit Logs</h3>
            <button onClick={fetchLogs} className="text-sm text-blue-600 hover:underline">Refresh</button>
          </div>
          {loadingLogs ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-400 text-sm">No activity yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">User</th>
                  <th className="py-2">Action</th>
                  <th className="py-2">Target</th>
                  <th className="py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b last:border-0">
                    <td className="py-2">{log.user?.name || 'Unknown'}</td>
                    <td className="py-2">{log.action}</td>
                    <td className="py-2 text-gray-500">{log.target || '-'}</td>
                    <td className="py-2 text-gray-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}