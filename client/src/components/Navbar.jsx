import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import DEFAULT_AVATAR from '../utils/defaultAvatar';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isAdmin = user?.role === 'admin';
  const navLinkClass = ({ isActive }) =>
    `navbar-link block py-1 text-sm font-medium text-white no-underline transition hover:opacity-80${isActive ? ' is-active' : ''}`;

  const handleLogout = () => {
    logout();
    navigate(isAdmin ? '/admin/login' : '/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:h-[70px] md:py-0">
        <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="text-2xl font-bold text-white no-underline transition hover:scale-105">
          📸 WeConnect
        </Link>

        <button
          className="text-2xl text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FiMenu />
        </button>

        <div className={`${menuOpen ? 'max-h-[420px] p-5' : 'max-h-0 p-0'} absolute left-0 right-0 top-full overflow-hidden bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300 md:static md:flex md:max-h-none md:items-center md:gap-7 md:bg-transparent md:p-0`}>
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className={navLinkClass}>Admin Dashboard</NavLink>
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Admin</span>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/gallery" className={navLinkClass}>Gallery</NavLink>
              <NavLink to="/videos" className={navLinkClass}>Videos</NavLink>
              <NavLink to="/close-friends" className={navLinkClass}>Close Friends</NavLink>
              <NavLink to="/search-users" className={navLinkClass}>Search Users</NavLink>
              <NavLink to="/connections" className={navLinkClass}>Connections</NavLink>
              <NavLink to="/requests" className={navLinkClass}>Requests</NavLink>
            </>
          )}

          <div className="mt-2 flex items-center gap-2 md:mt-0">
            {!isAdmin && (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md border border-white/30 bg-white/20 px-3 py-2 text-sm font-medium text-white no-underline transition hover:bg-white/30"
              >
                <img
                  src={user?.profilePhoto || DEFAULT_AVATAR}
                  alt="Profile"
                  className="h-7 w-7 rounded-full border border-white/40 object-cover"
                />
                Profile
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md border border-white/30 bg-white/20 px-4 py-2 font-medium text-white transition hover:bg-white/30"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
