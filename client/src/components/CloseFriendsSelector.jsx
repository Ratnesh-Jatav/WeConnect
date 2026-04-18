import React, { useEffect, useState } from 'react';
import { closeFriendService } from '../services/api';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

const CloseFriendsSelector = ({ visibility, selectedUsers, onChange }) => {
  const [closeFriends, setCloseFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const isPrivate = visibility === 'private';

  useEffect(() => {
    let isMounted = true;

    const loadCloseFriends = async () => {
      if (!isPrivate) return;

      setLoading(true);
      try {
        const response = await closeFriendService.getAll();
        if (!isMounted) return;
        setCloseFriends(response.data.closeFriends || []);
      } catch (error) {
        if (isMounted) {
          setCloseFriends([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCloseFriends();

    return () => {
      isMounted = false;
    };
  }, [isPrivate]);

  const toggleUser = (userId) => {
    const nextSelection = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];

    onChange(nextSelection);
  };

  if (!isPrivate) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">Close Friends Access</p>
        <p className="text-xs text-slate-500">Choose which close friends can open this private upload.</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading close friends...</p>
      ) : closeFriends.length === 0 ? (
        <p className="text-sm text-amber-700">No close friends added yet. Add family members first to share private content.</p>
      ) : (
        <div className="grid gap-2">
          {closeFriends.map((friend) => {
            const checked = selectedUsers.includes(friend._id);

            return (
              <label
                key={friend._id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                  checked ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleUser(friend._id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                />
                <img
                  src={friend.profilePhoto || DEFAULT_AVATAR}
                  alt={friend.name}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-slate-800">{friend.name}</p>
                  <p className="text-xs text-slate-500">{friend.email}</p>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CloseFriendsSelector;
