import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/api';
import VideoList from '../components/VideoList';
import UploadVideoModal from '../components/UploadVideoModal';
import SearchBar from '../components/SearchBar';

const Videos = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const canManageContent = isAuthenticated && !isAdmin;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await videoService.getAll({ search, eventType: eventFilter });
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  }, [search, eventFilter]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const eventTypes = ['wedding', 'birthday', 'festival', 'trip', 'anniversary', 'general', 'other'];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold md:text-3xl">Video Collection</h1>
          <p className="text-slate-500">Watch and manage family videos</p>
        </div>
        {canManageContent && (
          <button className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600" onClick={() => setShowModal(true)}>
            + Upload Video
          </button>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search videos..." />
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="min-w-[150px] rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">All Events</option>
          {eventTypes.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="px-5 py-10 text-center text-base text-slate-500">Loading videos...</div>
      ) : (
        <VideoList videos={videos} onUpdate={loadVideos} />
      )}

      {showModal && <UploadVideoModal onClose={() => setShowModal(false)} onUpload={loadVideos} />}
    </div>
  );
};

export default Videos;
