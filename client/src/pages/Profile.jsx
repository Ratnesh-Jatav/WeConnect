import React, { useEffect, useState } from 'react';
import { authService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', relation: '', bio: '', location: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLocalLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');

  const load = async () => {
    setLocalLoading(true);
    try {
      const res = await authService.getMe();
      const u = res.data.user;
      setForm({ name: u.name || '', relation: u.relation || '', bio: u.bio || '', location: u.location || '' });
      setPhotoPreview(u.profilePhoto || '');
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file || null);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('relation', form.relation || '');
    fd.append('bio', form.bio || '');
    fd.append('location', form.location || '');
    if (photoFile) fd.append('profilePhoto', photoFile);

    setLocalLoading(true);
    try {
      const res = await userService.updateProfile(fd);
      toast.success('Profile updated');
      const updated = res.data.user;
      updateUser({
        name: updated.name,
        profilePhoto: updated.profilePhoto,
        relation: updated.relation,
        bio: updated.bio,
      });
      setPhotoPreview(updated.profilePhoto || '');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="mb-4 text-2xl font-bold text-white">Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-md bg-white p-6 shadow-md">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Relation</label>
          <input name="relation" value={form.relation} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Photo</label>
          <div className="mt-2 flex items-center gap-3">
            <img src={photoPreview || user?.profilePhoto || DEFAULT_AVATAR} alt="Profile" className="h-14 w-14 rounded-full border border-slate-200 object-cover" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
