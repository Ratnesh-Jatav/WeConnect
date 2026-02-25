import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { albumService } from '../services/api';
import AlbumList from '../components/AlbumList';
import CreateAlbumModal from '../components/CreateAlbumModal';
import UploadPhotoModal from '../components/UploadPhotoModal';
import SearchBar from '../components/SearchBar';

const Gallery = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const canManageContent = isAuthenticated && !isAdmin;
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');

  const loadAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const response = await albumService.getAll({ search, eventType: eventFilter, year: yearFilter });
      setAlbums(response.data.albums);
    } catch (error) {
      console.error('Failed to load albums:', error);
    } finally {
      setLoading(false);
    }
  }, [search, eventFilter, yearFilter]);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  const eventTypes = ['wedding', 'birthday', 'festival', 'trip', 'anniversary', 'other'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-10 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold md:text-3xl">Photo Gallery</h1>
          <p className="text-slate-500">Browse and organize family memories by event</p>
        </div>
        {canManageContent && (
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600" onClick={() => setShowModal(true)}>
              + Create Album
            </button>
            <select
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              className="min-w-[180px] rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Select album for upload</option>
              {albums.map(album => (
                <option key={album._id} value={album._id}>{album.title}</option>
              ))}
            </select>
            <button
              className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => setShowUploadModal(true)}
              disabled={!selectedAlbumId}
              title={selectedAlbumId ? 'Upload photo to selected album' : 'Select an album first'}
            >
              + Upload Photo
            </button>
          </div>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search albums..." />
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

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="min-w-[150px] rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="px-5 py-10 text-center text-base text-slate-500">Loading albums...</div>
      ) : (
        <AlbumList albums={albums} onUpdate={loadAlbums} />
      )}

      {showModal && <CreateAlbumModal onClose={() => setShowModal(false)} onCreate={loadAlbums} />}
      {showUploadModal && (
        <UploadPhotoModal
          albumId={selectedAlbumId}
          onClose={() => setShowUploadModal(false)}
          onUpload={() => { loadAlbums(); setShowUploadModal(false); }}
        />
      )}
    </div>
  );
};

export default Gallery;
