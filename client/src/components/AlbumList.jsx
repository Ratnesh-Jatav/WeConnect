import React, { useState } from 'react';
import AlbumCard from './AlbumCard';
import AlbumDetailModal from './AlbumDetailModal';
import EditAlbumModal from './EditAlbumModal';

const AlbumList = ({ albums, onUpdate }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);

  return (
    <>
      {albums.length === 0 ? (
        <div className="px-5 py-16 text-center text-slate-500">
          <p>No albums found. Create your first album to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {albums.map(album => (
            <AlbumCard key={album._id} album={album} onViewPhotos={setSelectedAlbum} onDelete={onUpdate} onEdit={setEditingAlbum} />
          ))}
        </div>
      )}

      {selectedAlbum && (
        <AlbumDetailModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          onUpdate={() => {
            onUpdate();
            setSelectedAlbum(null);
          }}
        />
      )}

      {editingAlbum && (
        <EditAlbumModal
          album={editingAlbum}
          onClose={() => setEditingAlbum(null)}
          onUpdate={() => {
            onUpdate();
            setEditingAlbum(null);
          }}
        />
      )}
    </>
  );
};

export default AlbumList;
