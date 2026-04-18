import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { albumService } from '../services/api';
import toast from 'react-hot-toast';
import UploadPhotoModal from './UploadPhotoModal';
import { useAuth } from '../context/AuthContext';

const AlbumDetailModal = ({ album, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [photos, setPhotos] = useState(album.photos);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [zoom, setZoom] = useState(1);
  const albumOwnerId = typeof album.userId === 'object' ? album.userId?._id : album.userId;
  const canManageAlbum = albumOwnerId?.toString() === user?.id?.toString();

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('Delete this photo?')) {
      try {
        await albumService.deletePhoto(album._id, photoId);
        setPhotos(photos.filter(p => p._id !== photoId));
        toast.success('Photo deleted');
      } catch (error) {
        toast.error('Failed to delete photo');
      }
    }
  };

  const handlePhotoDoubleClick = (photo) => {
    const photoIndex = photos.findIndex(p => p._id === photo._id);
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(photoIndex);
    setZoom(1);
  };

  const handlePreviousPhoto = () => {
    if (selectedPhotoIndex > 0) {
      const newIndex = selectedPhotoIndex - 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
      setZoom(1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < photos.length - 1) {
      const newIndex = selectedPhotoIndex + 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
      setZoom(1);
    }
  };

  const handleZoom = (e) => {
    e.stopPropagation();
    setZoom(zoom < 3 ? zoom + 0.5 : 1);
  };

  const closeZoomModal = () => {
    setSelectedPhoto(null);
    setZoom(1);
  };

  const handlePhotoUpload = async () => {
    onUpdate();
    setShowUploadModal(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-5" onClick={onClose}>
      <div className="relative max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-4 top-3 text-3xl text-slate-500 hover:text-slate-800" onClick={onClose}><FiX /></button>

        <h2 className="mb-2 text-2xl font-semibold text-slate-800">{album.title}</h2>
        <p className="text-sm capitalize text-slate-500">{album.eventType} • {new Date(album.eventDate).toLocaleDateString()}</p>

        <div className="mt-5">
          {photos.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-500"><p>No photos in this album yet</p></div>
          ) : (
            <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {photos.map(photo => (
                <div key={photo._id} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    onDoubleClick={() => handlePhotoDoubleClick(photo)}
                    className="h-full w-full cursor-pointer object-cover"
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-black/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {photo.visibility === 'private' ? 'Private' : 'Public'}
                  </div>
                  {photo.caption && <p className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs text-white">{photo.caption}</p>}
                  {canManageAlbum && (
                    <button className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xl text-white opacity-0 transition group-hover:opacity-100" onClick={() => handleDeletePhoto(photo._id)}>×</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {canManageAlbum && (
            <button className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600" onClick={() => setShowUploadModal(true)}>+ Add Photo</button>
          )}
        </div>

        {showUploadModal && <UploadPhotoModal albumId={album._id} onClose={() => setShowUploadModal(false)} onUpload={handlePhotoUpload} />}

        {selectedPhoto && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/95" onClick={closeZoomModal}>
            <div className="relative flex h-[90%] w-[90%] flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-3xl text-white hover:bg-white/40" onClick={closeZoomModal}>×</button>

              <button className="absolute left-5 top-1/2 z-[5] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border-2 border-white/50 bg-white/30 text-3xl text-white hover:scale-110 hover:bg-white/50 disabled:opacity-30" onClick={handlePreviousPhoto} disabled={selectedPhotoIndex === 0} title="Previous photo">❮</button>

              <div className="flex h-full w-full items-center justify-center overflow-auto" onClick={handleZoom} style={{ cursor: zoom < 3 ? 'zoom-in' : 'zoom-out' }}>
                <img src={selectedPhoto.imageUrl} alt={selectedPhoto.caption} style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease', maxWidth: '100%', maxHeight: '100%' }} className="object-contain" />
              </div>

              <button className="absolute right-5 top-1/2 z-[5] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md border-2 border-white/50 bg-white/30 text-3xl text-white hover:scale-110 hover:bg-white/50 disabled:opacity-30" onClick={handleNextPhoto} disabled={selectedPhotoIndex === photos.length - 1} title="Next photo">❯</button>

              <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-black/50 p-4 text-center text-white">
                {selectedPhoto.caption && <p className="my-1 text-sm">{selectedPhoto.caption}</p>}
                <p className="mt-2.5 text-xs text-slate-300">Photo {selectedPhotoIndex + 1} of {photos.length} • Double-click to zoom (Current: {(zoom * 100).toFixed(0)}%)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetailModal;
