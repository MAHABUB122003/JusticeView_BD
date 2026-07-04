import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiUser, FiLogOut, FiSettings, FiChevronDown, FiMenu, FiX, FiHome, FiInfo, FiMail, FiGrid, FiShield, FiBookOpen, FiBook } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import SearchBar from '../ui/SearchBar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: <FiHome /> },
    { to: '/search', label: t('nav.search'), icon: <FiSearch /> },
    { to: '/directory', label: 'Directory', icon: <FiBook /> },
    { to: '/about', label: t('nav.about'), icon: <FiInfo /> },
    { to: '/contact', label: t('nav.contact'), icon: <FiMail /> },
  ];

  const isPolice = user?.role === 'police_officer';
  const isCourt = user?.role === 'court_clerk';
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <nav className="fixed top-0 w-full bg-justice-blue shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-justice-gold rounded-lg flex items-center justify-center font-bold text-justice-blue text-lg group-hover:scale-105 transition-transform">
              JV
            </div>
            <span className="text-2xl font-extrabold text-justice-gold tracking-tight">
              Justice<span className="text-white">View</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-justice-gold rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <SearchBar />

            <LanguageToggle />

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                  <div className="w-9 h-9 bg-justice-gold/20 rounded-full flex items-center justify-center text-justice-gold text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-white">{user.name?.split(' ')[0]}</span>
                  <FiChevronDown className="text-white/60 text-sm" />
                </button>

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 border border-light-gray/60 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-justice-blue to-justice-blue-light border-b border-light-gray/60">
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-off-white transition-colors">
                      <FiGrid className="text-justice-gold" /> {t('nav.dashboard')}
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-off-white transition-colors">
                      <FiUser className="text-justice-gold" /> {t('nav.profile')}
                    </Link>
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-off-white transition-colors">
                      <FiSettings className="text-justice-gold" /> {t('nav.settings')}
                    </Link>
                    {isPolice && (
                      <Link to="/police/arrest" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-off-white transition-colors">
                        <FiShield className="text-justice-gold" /> {t('nav.create', 'New Arrest')}
                      </Link>
                    )}
                    {isCourt && (
                      <Link to="/court/bail" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-off-white transition-colors">
                        <FiBookOpen className="text-justice-gold" /> {t('nav.create', 'Bail Entry')}
                      </Link>
                    )}
                    {(isAdmin) && (
                      <Link to="/admin/users" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-off-white transition-colors">
                        <FiSettings className="text-justice-gold" /> {t('nav.admin')}
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-light-gray/60 py-2">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-court-red hover:bg-red-50 transition-colors w-full">
                      <FiLogOut /> {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-white/80 hover:text-justice-gold px-4 py-2 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="bg-justice-gold text-white px-6 py-2.5 rounded-xl font-bold hover:bg-justice-gold-dark transition-all duration-300 shadow-lg shadow-justice-gold/30">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggles */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={() => setShowSearch(!showSearch)} className="text-white/80 hover:text-justice-gold">
              <FiSearch className="text-xl" />
            </button>
            <LanguageToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-white/80 hover:text-justice-gold">
              {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="lg:hidden px-4 pb-4 animate-slide-down">
          <SearchBar />
        </div>
      )}

      {/* Mobile nav */}
      {isOpen && (
        <div className="lg:hidden bg-justice-blue-dark border-t border-white/10 animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-justice-gold hover:bg-white/5 rounded-lg transition-colors">
                {link.icon}
                {link.label}
              </Link>
            ))}
            <hr className="border-white/10 my-2" />
            {user ? (
              <>
                <div className="px-4 py-3 text-sm text-white/60">{user.email}</div>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-justice-gold hover:bg-white/5 rounded-lg">
                  <FiGrid /> {t('nav.dashboard')}
                </Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-justice-gold hover:bg-white/5 rounded-lg">
                  <FiUser /> {t('nav.profile')}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-court-red hover:bg-red-900/20 rounded-lg w-full">
                  <FiLogOut /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="flex gap-3 px-4 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center px-4 py-3 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10">
                  {t('nav.login')}
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center px-4 py-3 text-sm font-bold text-white bg-justice-gold rounded-xl hover:bg-justice-gold-dark">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
