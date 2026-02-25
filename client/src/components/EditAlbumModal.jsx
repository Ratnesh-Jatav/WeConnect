import React, { useState, useEffect } from 'react';
import { albumService } from '../services/api';
import toast from 'react-hot-toast';

const EditAlbumModal = ({ album, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ title: '', description: '', coverImage: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        description: album.description || '',
        coverImage: album.coverImage || '',
      });
      setCoverFile(null);
    }
  }, [album]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setCoverFile(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload;
      if (coverFile) {
        payload = new FormData();
        payload.append('title', formData.title);
        payload.append('description', formData.description);
        payload.append('coverImage', coverFile);
      } else {
        payload = { ...formData };
      }

      await albumService.update(album._id, payload);
      toast.success('Album updated');
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-5" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-4 top-3 text-3xl text-slate-500 hover:text-slate-800" onClick={onClose}>×</button>
        <h2 className="mb-5 text-2xl font-semibold text-slate-800">Edit Album</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-800">Album Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Album title" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Album description" rows="3" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Cover Image URL (optional)</label>
            <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Or upload cover image (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />
            <p className="mt-2 text-xs text-slate-500">Uploading a file will replace the existing cover image.</p>
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button type="button" className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAlbumModal;
