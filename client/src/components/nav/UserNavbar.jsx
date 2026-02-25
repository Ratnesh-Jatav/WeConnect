import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import DEFAULT_AVATAR from '../../utils/defaultAvatar';

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:h-[70px] md:py-0">
        <Link to="/dashboard" className="text-2xl font-bold text-white no-underline transition hover:scale-105">
          📸 Family Memory
        </Link>

        <button className="text-2xl text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu />
        </button>

        <div className={`${menuOpen ? 'max-h-[420px] p-5' : 'max-h-0 p-0'} absolute left-0 right-0 top-full overflow-hidden bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300 md:static md:flex md:max-h-none md:items-center md:gap-7 md:bg-transparent md:p-0`}>
          <Link to="/dashboard" className="block py-1 text-sm font-medium text-white no-underline transition hover:opacity-80">Dashboard</Link>
          <Link to="/gallery" className="block py-1 text-sm font-medium text-white no-underline transition hover:opacity-80">Gallery</Link>
          <Link to="/videos" className="block py-1 text-sm font-medium text-white no-underline transition hover:opacity-80">Videos</Link>
          <Link to="/search-users" className="block py-1 text-sm font-medium text-white no-underline transition hover:opacity-80">Add Members</Link>
          <Link to="/connections" className="block py-1 text-sm font-medium text-white no-underline transition hover:opacity-80">Connections</Link>
          <Link to="/requests" className="block py-1 text-sm font-medium text-white no-underline transition hover:opacity-80">Requests</Link>

          <div className="mt-2 flex items-center gap-2 md:mt-0">
            <Link to="/profile" className="flex items-center gap-2 rounded-md border border-white/30 bg-white/20 px-3 py-2 text-sm font-medium text-white no-underline transition hover:bg-white/30">
              <img src={user?.profilePhoto || DEFAULT_AVATAR} alt="Profile" className="h-7 w-7 rounded-full border border-white/40 object-cover" />
              Profile
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-md border border-white/30 bg-white/20 px-4 py-2 font-medium text-white transition hover:bg-white/30">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
