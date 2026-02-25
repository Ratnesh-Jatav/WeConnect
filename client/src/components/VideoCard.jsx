import React from 'react';
import { videoService } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VideoCard = ({ video, onDelete }) => {
  const { user } = useAuth();
  const videoOwnerId = typeof video.userId === 'object' ? video.userId?._id : video.userId;
  const canDeleteVideo = videoOwnerId?.toString() === user?.id?.toString();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this video?')) {
      try {
        await videoService.delete(video._id);
        toast.success('Video deleted');
        onDelete();
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-indigo-500 to-violet-600 text-5xl text-white">🎬</div>
        )}
        {video.duration && <span className="absolute bottom-2.5 right-2.5 rounded bg-black/80 px-2 py-1 text-xs font-semibold text-white">{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</span>}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">{video.title}</h3>
        <p className="mb-2 text-sm font-semibold capitalize text-indigo-500">{video.eventType}</p>
        {video.description && <p className="mb-2.5 flex-1 text-[13px] text-slate-500">{video.description}</p>}
        <p className="mb-4 text-xs text-slate-400">{new Date(video.createdAt).toLocaleDateString()}</p>

        <div className="mt-auto flex gap-2.5">
          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-lg bg-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-800 hover:bg-slate-300">Watch</a>
          {canDeleteVideo && (
            <button className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
