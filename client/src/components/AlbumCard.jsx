import React from 'react';
import { albumService } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AlbumCard = ({ album, onDelete, onViewPhotos, onEdit }) => {
  const { user, isAdmin } = useAuth();
  const albumOwnerId = typeof album.userId === 'object' ? album.userId?._id : album.userId;
  const canDeleteAlbum = albumOwnerId?.toString() === user?.id?.toString();
  const canEditAlbum = isAdmin || albumOwnerId?.toString() === user?.id?.toString();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await albumService.delete(album._id);
        toast.success('Album deleted');
        onDelete();
      } catch (error) {
        toast.error('Failed to delete album');
      }
    }
  };

  const eventDate = new Date(album.eventDate).toLocaleDateString();

  return (
    <div className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" onClick={() => onViewPhotos(album)}>
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {album.coverImage ? (
          <img src={album.coverImage} alt={album.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-indigo-500 to-violet-600 text-5xl text-white">{album.eventType.charAt(0).toUpperCase()}</div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="rounded-lg bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800" onClick={() => onViewPhotos(album)}>View Photos</button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">{album.title}</h3>
        <p className="mb-1 text-sm font-semibold capitalize text-indigo-500">{album.eventType}</p>
        <p className="mb-2.5 text-[13px] text-slate-500">{eventDate}</p>
        {album.description && <p className="mb-2.5 text-[13px] text-slate-500">{album.description}</p>}
        <p className="mb-4 text-[13px] font-medium text-slate-500">{album.photos.length} photos</p>
        <div className="mt-auto flex gap-2">
          {canEditAlbum && (
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-600" onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(album); }}>Edit</button>
          )}
          {canDeleteAlbum && (
            <button className="rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
