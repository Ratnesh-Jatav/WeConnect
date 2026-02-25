import React, { useEffect, useState } from 'react';
import { connectionService } from '../services/api';
import { toast } from 'react-hot-toast';
import ProfilePreviewModal from '../components/ProfilePreviewModal';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

export default function ConnectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUserId, setPreviewUserId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await connectionService.incomingRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const accept = async (id) => {
    try {
      await connectionService.acceptRequest(id);
      toast.success('Accepted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to accept');
    }
  };

  const reject = async (id) => {
    try {
      await connectionService.rejectRequest(id);
      toast.success('Rejected');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold md:text-3xl">Connection Requests</h1>
        <p className="text-sm text-slate-500">Review and respond to incoming connection requests.</p>
      </div>

      {loading && <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">Loading requests...</div>}
      {!loading && requests.length === 0 && <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">No incoming requests</div>}

      <div className="grid gap-3">
        {requests.map((r) => (
          <div key={r._id} className="flex flex-col justify-between gap-4 rounded-xl bg-white p-4 shadow-md sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <img src={r.profilePhoto || DEFAULT_AVATAR} alt="pf" className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
              <div>
                <div className="font-semibold text-slate-800 cursor-pointer text-indigo-600 hover:underline" onClick={() => { setPreviewUserId(r._id); setPreviewOpen(true); }}>{r.name}</div>
                <div className="text-sm text-slate-500">{r.email}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600" onClick={() => accept(r._id)}>Accept</button>
              <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600" onClick={() => reject(r._id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
      <ProfilePreviewModal userId={previewUserId} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
