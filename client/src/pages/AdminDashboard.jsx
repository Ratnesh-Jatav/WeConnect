import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';
import toast from 'react-hot-toast';
import { FiHome, FiUsers, FiImage, FiVideo, FiTrash2, FiLogOut } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Unauthorized access');
      return;
    }
    loadStats();
  }, [user?.role]);

  useEffect(() => {
    if (activeTab === 'stats') loadStats();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'albums') loadAlbums();
    if (activeTab === 'videos') loadVideos();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data.stats || response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAlbums();
      setAlbums(response.data.albums || []);
    } catch (error) {
      toast.error('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllVideos();
      setVideos(response.data.videos || []);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All their content will be removed.')) {
      return;
    }
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm('Are you sure you want to delete this album?')) {
      return;
    }
    try {
      await adminService.deleteAlbum(albumId);
      toast.success('Album deleted successfully');
      loadAlbums();
    } catch (error) {
      toast.error('Failed to delete album');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    try {
      await adminService.deleteVideo(videoId);
      toast.success('Video deleted successfully');
      loadVideos();
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const navBtnClass = (isActive) =>
    `flex items-center gap-4 border-l-4 px-5 py-3 text-left text-base transition ${
      isActive
        ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400'
        : 'border-l-transparent text-slate-400 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:h-screen md:flex-row">
      <div className="w-full bg-slate-900 text-white shadow-lg md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-[250px] md:flex-col md:py-8">
        <div className="border-b-2 border-slate-700 px-5 py-4 md:mb-8 md:py-0 md:pb-5">
          <h2 className="mb-2 text-2xl font-bold">Admin Panel</h2>
          <p className="break-words text-xs text-slate-400">{user?.email}</p>
        </div>

        <nav className="flex flex-1 flex-row gap-1 overflow-x-auto px-2 py-2 md:flex-col md:gap-2.5 md:px-2.5 md:py-0">
          <button className={navBtnClass(activeTab === 'stats')} onClick={() => setActiveTab('stats')}>
            <FiHome /> Statistics
          </button>
          <button className={navBtnClass(activeTab === 'users')} onClick={() => setActiveTab('users')}>
            <FiUsers /> Users
          </button>
          <button className={navBtnClass(activeTab === 'albums')} onClick={() => setActiveTab('albums')}>
            <FiImage /> Albums
          </button>
          <button className={navBtnClass(activeTab === 'videos')} onClick={() => setActiveTab('videos')}>
            <FiVideo /> Videos
          </button>
        </nav>

        <button
          className="m-2.5 flex items-center gap-4 rounded-md px-5 py-3 text-base text-red-400 transition hover:bg-red-400/10"
          onClick={logout}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="flex-1 p-5 md:ml-[250px] md:p-10">
        {loading && <div className="py-10 text-center text-base text-slate-500">Loading...</div>}

        {activeTab === 'stats' && stats && (
          <div className="rounded-xl bg-white p-8 shadow-md">
            <h2 className="mb-7 text-2xl font-semibold text-slate-900">Dashboard Statistics</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-center text-white shadow-lg shadow-indigo-500/30">
                <h3 className="mb-4 text-sm font-semibold opacity-90">Total Users</h3>
                <p className="text-4xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-center text-white shadow-lg shadow-indigo-500/30">
                <h3 className="mb-4 text-sm font-semibold opacity-90">Total Albums</h3>
                <p className="text-4xl font-bold">{stats.totalAlbums}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-center text-white shadow-lg shadow-indigo-500/30">
                <h3 className="mb-4 text-sm font-semibold opacity-90">Total Photos</h3>
                <p className="text-4xl font-bold">{stats.totalPhotos}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-center text-white shadow-lg shadow-indigo-500/30">
                <h3 className="mb-4 text-sm font-semibold opacity-90">Total Videos</h3>
                <p className="text-4xl font-bold">{stats.totalVideos}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="rounded-xl bg-white p-8 shadow-md">
            <h2 className="mb-7 text-2xl font-semibold text-slate-900">All Users ({users.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b-2 border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Joined</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{u.name}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{u.email}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">
                        {u.role !== 'admin' && (
                          <button
                            className="inline-flex items-center gap-1 rounded-md bg-red-400 px-3 py-2 text-base text-white transition hover:bg-red-500"
                            onClick={() => handleDeleteUser(u._id)}
                            title="Delete user"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="rounded-xl bg-white p-8 shadow-md">
            <h2 className="mb-7 text-2xl font-semibold text-slate-900">All Albums ({albums.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b-2 border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Album Name</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Owner</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Photos</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Public</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Created</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {albums.map((album) => (
                    <tr key={album._id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{album.title}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{album.userId?.name || 'Unknown'}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{album.photos?.length || 0}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{album.isPublic ? '✓' : '✗'}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{new Date(album.createdAt).toLocaleDateString()}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">
                        <button
                          className="inline-flex items-center gap-1 rounded-md bg-red-400 px-3 py-2 text-base text-white transition hover:bg-red-500"
                          onClick={() => handleDeleteAlbum(album._id)}
                          title="Delete album"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="rounded-xl bg-white p-8 shadow-md">
            <h2 className="mb-7 text-2xl font-semibold text-slate-900">All Videos ({videos.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b-2 border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Video Title</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Owner</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Public</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Created</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video._id} className="hover:bg-slate-50">
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{video.title}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{video.userId?.name || 'Unknown'}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{video.isPublic ? '✓' : '✗'}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">{new Date(video.createdAt).toLocaleDateString()}</td>
                      <td className="border-b border-slate-200 px-4 py-4 text-sm">
                        <button
                          className="inline-flex items-center gap-1 rounded-md bg-red-400 px-3 py-2 text-base text-white transition hover:bg-red-500"
                          onClick={() => handleDeleteVideo(video._id)}
                          title="Delete video"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
