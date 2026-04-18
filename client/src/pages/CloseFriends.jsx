import React, { useCallback, useEffect, useState } from 'react';
import { closeFriendService } from '../services/api';
import { toast } from 'react-hot-toast';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

const CloseFriends = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);

  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await closeFriendService.getCandidates();
      setCandidates(response.data.candidates || []);
    } catch (error) {
      const status = error?.response?.status;
      const message =
        status === 404
          ? 'Close Friends API not found. Make sure the backend was restarted.'
          : status
            ? error?.response?.data?.message || 'Failed to load close friend candidates'
            : 'Cannot reach backend. Make sure the server is running on port 5000.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleToggle = async (candidate) => {
    try {
      setSavingUserId(candidate._id);
      if (candidate.isCloseFriend) {
        await closeFriendService.remove(candidate._id);
        toast.success(`${candidate.name} removed from close friends`);
      } else {
        await closeFriendService.add(candidate._id);
        toast.success(`${candidate.name} added to close friends`);
      }

      await loadCandidates();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update close friends');
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-white md:text-3xl">Close Friends</h1>
        <p className="text-sm text-slate-500">
          Control which family connections can view your private photos and videos.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">
          Loading close friends...
        </div>
      ) : candidates.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500 shadow-md">
          Add connections first before building your close friends list.
        </div>
      ) : (
        <div className="grid gap-3">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={candidate.profilePhoto || DEFAULT_AVATAR}
                  alt={candidate.name}
                  className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-800">{candidate.name}</p>
                  <p className="text-sm text-slate-500">{candidate.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(candidate)}
                disabled={savingUserId === candidate._id}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                  candidate.isCloseFriend
                    ? 'bg-slate-700 hover:bg-slate-800'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {savingUserId === candidate._id
                  ? 'Saving...'
                  : candidate.isCloseFriend
                    ? 'Remove'
                    : 'Add to Close Friends'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CloseFriends;
