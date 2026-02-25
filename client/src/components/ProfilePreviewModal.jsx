import React, { useEffect, useState } from 'react';
import { userService } from '../services/api';
import { toast } from 'react-hot-toast';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

export default function ProfilePreviewModal({ userId, open, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await userService.getProfile(userId);
        setProfile(res.data.profile);
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, userId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Profile Preview</h3>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>

        {loading && <div className="mt-4 text-sm text-slate-500">Loading...</div>}

        {!loading && profile && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-4">
              <img src={profile.profilePhoto || DEFAULT_AVATAR} alt="pf" className="h-16 w-16 rounded-full object-cover" />
              <div>
                <div className="text-lg font-semibold">{profile.name}</div>
                {profile.relation && <div className="text-sm text-slate-500">{profile.relation}</div>}
              </div>
            </div>

            {profile.bio && (
              <div>
                <div className="text-sm font-medium text-slate-700">About</div>
                <div className="text-sm text-slate-600">{profile.bio}</div>
              </div>
            )}

            {profile.location && (
              <div>
                <div className="text-sm font-medium text-slate-700">Location</div>
                <div className="text-sm text-slate-600">{profile.location}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
