import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import { urlService } from '../services/urlService';
import { groupService } from '../services/groupService';
import { useAuth } from '../contexts/AuthContext';
import {
  LinkIcon,
  ChartBarIcon,
  EyeIcon,
  GlobeAltIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, skipping dashboard data fetch');
        console.log('Auth state:', { isAuthenticated, user: user ? 'exists' : 'null' });
        console.log('Local storage token:', localStorage.getItem('token') ? 'exists' : 'missing');
        setLoading(false);
        setError('User not authenticated');
        return;
      }

      // Prevent multiple API calls
      if (hasFetched) {
        console.log('Dashboard data already fetched, skipping');
        return;
      }

      try {
        console.log('Fetching dashboard data for user:', user.email);
        console.log('Token from localStorage:', localStorage.getItem('token') ? 'exists' : 'missing');
        
        // Use Promise.allSettled to handle partial failures gracefully
        const results = await Promise.allSettled([
          dashboardService.getDashboardStats(),
          dashboardService.getAnalytics(),
          urlService.getShortUrls(),
          groupService.getGroups(),
        ]);

        console.log('API call results:', results);

        // Extract data with fallbacks for failed requests
        const [statsResult, analyticsResult, urlsResult, groupsResult] = results;
        
        // Log detailed results for debugging
        console.log('Detailed API results:', {
          stats: statsResult,
          analytics: analyticsResult,
          urls: urlsResult,
          groups: groupsResult
        });
        
        // Set stats with fallback
        if (statsResult.status === 'fulfilled' && statsResult.value?.data && typeof statsResult.value.data === 'object') {
          setStats(statsResult.value.data);
        } else {
          const errorMessage = statsResult.reason?.message || statsResult.reason || 'Unknown error';
          console.error('Failed to fetch stats:', errorMessage);
          console.error('Stats result details:', statsResult);
          setStats({ 
            overview: { totalUrls: 0, totalClicks: 0, totalGroups: 0, activeUrls: 0, expiredUrls: 0 },
            recentActivity: [],
            topPerforming: [],
            groupSummary: []
          });
        }

        // Set analytics with fallback
        if (analyticsResult.status === 'fulfilled' && analyticsResult.value?.data && typeof analyticsResult.value.data === 'object') {
          setAnalytics(analyticsResult.value.data);
        } else {
          const errorMessage = analyticsResult.reason?.message || analyticsResult.reason || 'Unknown error';
          console.error('Failed to fetch analytics:', errorMessage);
          console.error('Analytics result details:', analyticsResult);
          setAnalytics({ 
            period: '7d',
            clicksByDate: [],
            urlsByDate: [],
            groupDistribution: []
          });
        }

        // Set recent URLs with fallback
        if (urlsResult.status === 'fulfilled' && urlsResult.value && Array.isArray(urlsResult.value)) {
          setRecentUrls(urlsResult.value.slice(0, 5));
        } else {
          const errorMessage = urlsResult.reason?.message || urlsResult.reason || 'Unknown error';
          console.error('Failed to fetch URLs:', errorMessage);
          console.error('URLs result details:', urlsResult);
          setRecentUrls([]);
        }

        // Set recent groups with fallback
        if (groupsResult.status === 'fulfilled' && groupsResult.value && Array.isArray(groupsResult.value)) {
          setRecentGroups(groupsResult.value.slice(0, 5));
        } else {
          const errorMessage = groupsResult.reason?.message || groupsResult.reason || 'Unknown error';
          console.error('Failed to fetch groups:', errorMessage);
          console.error('Groups result details:', groupsResult);
          setRecentGroups([]);
        }

        setHasFetched(true);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setError(error.message || 'Failed to fetch dashboard data');
        // Set fallback values on complete failure
        setStats({ 
          overview: { totalUrls: 0, totalClicks: 0, totalGroups: 0, activeUrls: 0, expiredUrls: 0 },
          recentActivity: [],
          topPerforming: [],
          groupSummary: []
        });
        setAnalytics({ 
          period: '7d',
          clicksByDate: [],
          urlsByDate: [],
          groupDistribution: []
        });
        setRecentUrls([]);
        setRecentGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user, hasFetched]);

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-blue-500 text-xl mb-4">🔐</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to access your dashboard.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Debug Section - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">🔍 Debug Info</h3>
          <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
            <div>Auth State: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
            <div>User: {user ? `${user.email} (${user.id})` : 'None'}</div>
            <div>Token: {localStorage.getItem('token') ? '✅ Exists' : '❌ Missing'}</div>
            <div>Loading: {loading ? '✅ Yes' : '❌ No'}</div>
            <div>Error: {error || 'None'}</div>
          </div>
          
          {/* Authentication Test Buttons */}
          <div className="mt-3 space-y-2">
            <button 
              onClick={() => {
                console.log('Current localStorage:', {
                  token: localStorage.getItem('token'),
                  refreshToken: localStorage.getItem('refreshToken')
                });
                console.log('Current auth state:', { isAuthenticated, user });
              }}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Log Auth State
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.reload();
              }}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 ml-2"
            >
              Clear Tokens
            </button>
            <button 
              onClick={() => {
                window.location.href = '/login';
              }}
              className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 ml-2"
            >
              Go to Login
            </button>
            <button 
              onClick={async () => {
                try {
                  console.log('Testing URL service...');
                  const urls = await urlService.getShortUrls();
                  console.log('URL service result:', urls);
                  
                  console.log('Testing Group service...');
                  const groups = await groupService.getGroups();
                  console.log('Group service result:', groups);
                } catch (error) {
                  console.error('Service test error:', error);
                }
              }}
              className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 ml-2"
            >
              Test Services
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your URLs.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card-hover"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <LinkIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total URLs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.totalUrls || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-hover"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <EyeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.totalClicks || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-hover"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <GlobeAltIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Groups</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.totalGroups || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card-hover"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. CTR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.averageCTR ? `${stats.overview.averageCTR.toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Clicks by Date</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.clicksByDate || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Performing URLs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Group Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.groupDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="groupName" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent URLs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent URLs</h3>
            <a href="/urls" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentUrls.length > 0 ? (
              recentUrls.map((url, index) => (
                <div key={url._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {url.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {url.shortUrl}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {url.noOfClicks || 0} clicks
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {url.lastAccessed ? new Date(url.lastAccessed).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No URLs created yet</p>
            )}
          </div>
        </motion.div>

        {/* Recent Groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Groups</h3>
            <a href="/groups" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentGroups.length > 0 ? (
              recentGroups.map((group, index) => (
                <div key={group._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {group.urlCount || 0} URLs
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {group.totalClicks || 0} clicks
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No groups created yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/urls"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <LinkIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
            <span className="text-primary-700 dark:text-primary-300 font-medium">Create New URL</span>
          </a>
          
          <a
            href="/groups"
            className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
            <span className="text-green-700 dark:text-green-300 font-medium">Create New Group</span>
          </a>
          
          <a
            href="/profile"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
            <span className="text-purple-700 dark:text-purple-300 font-medium">View Profile</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
