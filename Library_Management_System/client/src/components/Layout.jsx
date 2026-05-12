import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform ${
    isActive
      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg scale-105'
      : 'text-gray-700 hover:bg-yellow-100 hover:text-yellow-700 hover:shadow-md'
  }`;

export default function Layout() {
  const { member, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-yellow-50 to-white">
      <header className="glass sticky top-0 z-40 shadow-md border-b-2 border-yellow-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">📚</div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
              Digital Library
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/books" className={linkClass}>
              Books
            </NavLink>
            <NavLink to="/loans" className={linkClass}>
              Issue / Return
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col items-end text-gray-700">
              <span className="font-semibold">{member?.name}</span>
              <span className="text-xs text-yellow-600 font-medium">({member?.role})</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-12 bg-white/50 border-t-2 border-yellow-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2026 Digital Library Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
