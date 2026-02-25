import React, { useState } from 'react';
import { connectionService } from '../services/api';
import { toast } from 'react-hot-toast';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

export default function SearchUsers() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await connectionService.searchUsers(q.trim());
      setResults(res?.data?.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (userId) => {
    try {
      await connectionService.sendRequest(userId);
      toast.success('Request sent');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold md:text-3xl">Search Users</h1>
        <p className="text-sm text-slate-500">Find family members by name or email and send connection requests.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-md sm:grid-cols-[1fr_auto]">
        <input
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          placeholder="Search by name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="grid gap-3">
        {!loading && results.length === 0 && <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">No results yet</div>}
        {results.map((u) => (
          <div key={u._id} className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 shadow-md sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <img src={u.profilePhoto || DEFAULT_AVATAR} alt="pf" className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
              <div>
                <div className="font-semibold text-slate-800">{u.name}</div>
                <div className="text-sm text-slate-500">{u.email}</div>
              </div>
            </div>
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600" onClick={() => handleSend(u._id)}>Send Request</button>
          </div>
        ))}
      </div>
    </div>
  );
}
