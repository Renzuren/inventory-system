import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { APP_NAME } from '../config';

export default function Layout({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header / Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Package className="w-7 h-7 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">{APP_NAME}</span>
          </Link>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-medium transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-emerald-600 font-medium transition">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden lg:inline text-sm text-gray-600 mr-2">
                  Hello, {user.firstName || user.email}
                </span>
                <Link
                  to="/dashboard"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 font-medium text-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-emerald-600 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation (simplified) */}
        <div className="md:hidden border-t border-gray-200 px-6 py-3 flex justify-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-emerald-600 text-sm font-medium">
            Contact
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}