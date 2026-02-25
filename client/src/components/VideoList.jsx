import React from 'react';
import VideoCard from './VideoCard';

const VideoList = ({ videos, onUpdate }) => {
  return (
    <>
      {videos.length === 0 ? (
        <div className="px-5 py-16 text-center text-slate-500">
          <p>No videos found. Upload your first video to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videos.map(video => <VideoCard key={video._id} video={video} onDelete={onUpdate} />)}
        </div>
      )}
    </>
  );
};

export default VideoList;
