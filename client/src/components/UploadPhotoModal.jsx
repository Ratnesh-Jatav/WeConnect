import React, { useState } from 'react';
import { albumService } from '../services/api';
import toast from 'react-hot-toast';
import CloseFriendsSelector from './CloseFriendsSelector';

const UploadPhotoModal = ({ albumId, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [allowedUsers, setAllowedUsers] = useState([]);
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
      if (visibility === 'private' && allowedUsers.length === 0) {
        toast.error('Select at least one close friend for private photos');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('caption', caption);
      formData.append('visibility', visibility);
      formData.append('allowedUsers', JSON.stringify(allowedUsers));
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

          <div>
            <label className="mb-2 block font-medium text-slate-800">Visibility</label>
            <div className="grid grid-cols-2 gap-3">
              {['public', 'private'].map((option) => (
                <label
                  key={option}
                  className={`cursor-pointer rounded-lg border p-3 text-sm ${
                    visibility === option ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={option}
                    checked={visibility === option}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="mr-2"
                  />
                  {option === 'public' ? 'Public' : 'Private (Close Friends)'}
                </label>
              ))}
            </div>
          </div>

          <CloseFriendsSelector
            visibility={visibility}
            selectedUsers={allowedUsers}
            onChange={setAllowedUsers}
          />

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
