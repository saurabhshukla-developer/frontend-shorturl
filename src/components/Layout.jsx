import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  LinkIcon,
  FolderIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from './ChatBot';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, description: 'Overview and analytics' },
    { name: 'URLs', href: '/urls', icon: LinkIcon, description: 'Manage your short URLs' },
    { name: 'Groups', href: '/groups', icon: FolderIcon, description: 'Organize URLs by groups' },
    { name: 'Profile', href: '/profile', icon: UserIcon, description: 'Account settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 120,
                mass: 0.8
              }}
              className="relative flex w-full max-w-sm flex-1 flex-col bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl pt-5 pb-4 shadow-2xl border-r border-gray-200/20 dark:border-gray-700/20"
            >
              {/* Close button */}
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm hover:bg-gray-200/80 dark:hover:bg-gray-600/80 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              {/* Logo */}
              <div className="flex flex-shrink-0 items-center px-6 mb-8">
                <Link to="/" className="flex items-center group">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <LinkIcon className="h-7 w-7 text-white" />
                  </div>
                  <span className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">URLShortner</span>
                </Link>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 space-y-2 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-500/15 to-primary-600/15 text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-700/50 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-4 h-5 w-5 transition-colors ${
                      isActive(item.href) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                    }`} />
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* User profile section */}
              <div className="px-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center p-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-600/50 active:scale-95"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden xl:fixed xl:inset-y-0 xl:flex xl:w-80 xl:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="flex flex-1 flex-col overflow-y-auto pt-8 pb-6">
            <div className="flex flex-shrink-0 items-center px-8">
              <Link to="/" className="flex items-center group">
                <div className="h-12 w-12 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <LinkIcon className="h-7 w-7 text-white" />
                </div>
                <span className="ml-4 text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">URLShortner</span>
              </Link>
            </div>
            
            <nav className="mt-10 flex-1 space-y-3 px-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-primary-500/15 to-primary-600/15 text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-700/50 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-4 h-5 w-5 transition-colors ${
                    isActive(item.href) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200'
                  }`} />
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              ))}
            </nav>

            {/* User profile section at bottom */}
            <div className="px-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center p-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-600/50"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="xl:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 xl:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            
            <div className="flex items-center gap-x-3 lg:gap-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative active:scale-95">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* User menu - Desktop only */}
              <div className="hidden md:flex items-center gap-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* ChatBot - available on all pages for logged-in users */}
      {user && <ChatBot />}
    </div>
  );
};

export default Layout;
