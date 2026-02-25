import React, { useState } from 'react';
import { albumService } from '../services/api';
import toast from 'react-hot-toast';

const UploadPhotoModal = ({ albumId, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);
      await albumService.uploadPhoto(albumId, formData);
      toast.success('Photo uploaded!');
      onUpload();
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-5" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-4 top-3 text-3xl text-slate-500 hover:text-slate-800" onClick={onClose}>×</button>
        <h2 className="mb-5 text-2xl font-semibold text-slate-800">Upload Photo</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {preview && (
            <div className="mb-5 overflow-hidden rounded-lg">
              <img src={preview} alt="Preview" className="max-h-[300px] w-full object-cover" />
            </div>
          )}

          <div>
            <label className="mb-2 block font-medium text-slate-800">Select Image *</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full rounded-lg border border-slate-200 p-3 text-sm" required />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-800">Caption</label>
            <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption" className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100" />
          </div>

          <div className="mt-5 flex justify-end gap-2.5">
            <button type="button" className="rounded-lg bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60" disabled={loading || !file}>{loading ? 'Uploading...' : 'Upload Photo'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
