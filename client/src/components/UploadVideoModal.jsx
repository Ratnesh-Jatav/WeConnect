import React, { useState } from 'react';
import { videoService } from '../services/api';
import toast from 'react-hot-toast';

const eventTypes = ['wedding', 'birthday', 'festival', 'trip', 'anniversary', 'general', 'other'];

const UploadVideoModal = ({ onClose, onUpload }) => {
  const [formData, setFormData] = useState({ title: '', description: '', eventType: 'general' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('eventType', formData.eventType);
      uploadFormData.append('video', file);
      await videoService.upload(uploadFormData);
      toast.success('Video uploaded!');
      onUpload();
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-5" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-4 top-3 text-3xl text-slate-500 hover:text-slate-800" onClick={onClose}>×</button>
        <h2 className="mb-5 text-2xl font-semibold text-slate-800">Upload Video</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-slate-800">Video Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Video title" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" required />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Select Video File *</label>
            <input type="file" accept="video/*" onChange={handleFileChange} className="w-full rounded-lg border border-slate-200 p-3 text-sm" required />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Event Type</label>
            <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100">
              {eventTypes.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Video description" rows="3" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button type="button" className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60" disabled={loading || !file}>{loading ? 'Uploading...' : 'Upload Video'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideoModal;
