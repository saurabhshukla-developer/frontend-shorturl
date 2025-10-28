import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import { urlService } from '../services/urlService';
import { groupService } from '../services/groupService';
import { useAuth } from '../contexts/AuthContext';
import ChatBot from '../components/ChatBot';
import {
  LinkIcon,
  ChartBarIcon,
  EyeIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FolderIcon,
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
        setLoading(false);
        setError('User not authenticated');
        return;
      }

      // Prevent multiple API calls
      if (hasFetched) {
        return;
      }

      try {
        // Use Promise.allSettled to handle partial failures gracefully
        const results = await Promise.allSettled([
          dashboardService.getDashboardStats(),
          dashboardService.getAnalytics(),
          urlService.getShortUrls(),
          groupService.getGroups(),
        ]);

        // Extract data with fallbacks for failed requests
        const [statsResult, analyticsResult, urlsResult, groupsResult] = results;
        
        // Set stats with fallback
        if (statsResult.status === 'fulfilled' && statsResult.value?.data && typeof statsResult.value.data === 'object') {
          setStats(statsResult.value.data);
        } else {
          const errorMessage = statsResult.reason?.message || statsResult.reason || 'Unknown error';
          setStats({ 
            overview: { totalUrls: 0, totalClicks: 0, totalGroups: 0, activeUrls: 0, expiredUrls: 0, averageCTR: 0 },
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
          setRecentUrls([]);
        }

        // Set recent groups with fallback
        if (groupsResult.status === 'fulfilled' && groupsResult.value && Array.isArray(groupsResult.value)) {
          setRecentGroups(groupsResult.value.slice(0, 5));
        } else {
          const errorMessage = groupsResult.reason?.message || groupsResult.reason || 'Unknown error';
          setRecentGroups([]);
        }

        setHasFetched(true);
      } catch (error) {
        setError(error.message || 'Failed to fetch dashboard data');
        // Set fallback values on complete failure
        setStats({ 
          overview: { totalUrls: 0, totalClicks: 0, totalGroups: 0, activeUrls: 0, expiredUrls: 0, averageCTR: 0 },
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0">
            Here's what's happening with your URLs today. Track performance, monitor growth, and optimize your link strategy.
          </p>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-700"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <LinkIcon className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total URLs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.totalUrls || 0}
              </p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400">+12%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-green-200 dark:hover:border-green-700"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <EyeIcon className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.totalClicks || 0}
              </p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400">+8%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-yellow-200 dark:hover:border-yellow-700"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <UsersIcon className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Active Groups</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.totalGroups || 0}
              </p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400">+5%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-700"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Avg. CTR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.overview?.averageCTR !== undefined ? `${stats.overview.averageCTR.toFixed(1)}%` : '0%'}
              </p>
              <div className="flex items-center mt-1">
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 dark:text-green-400">+2.1%</span>
              </div>
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
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Clicks by Date</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</span>
                <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
              </div>
            </div>
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
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Group Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Group Distribution</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">URL count by group</span>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
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
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent URLs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent URLs</h3>
              <a href="/urls" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium hover:underline transition-colors">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {recentUrls.length > 0 ? (
                recentUrls.map((url, index) => (
                  <div key={url._id || `recent-url-${index}`} className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                        {url.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
                        {url.shortUrl}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {url.noOfClicks || 0}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">clicks</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <LinkIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No URLs created yet</p>
                  <a href="/urls" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-xs font-medium hover:underline mt-1 inline-block">
                    Create your first URL →
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Groups</h3>
              <a href="/groups" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium hover:underline transition-colors">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {recentGroups.length > 0 ? (
                recentGroups.map((group, index) => (
                  <div key={group._id || `recent-group-${index}`} className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                        {group.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {group.urlCount || 0} URLs
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {group.totalClicks || 0}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">total clicks</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FolderIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No groups created yet</p>
                  <a href="/groups" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 text-xs font-medium hover:underline mt-1 inline-block">
                    Create your first group →
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-primary-200/50 dark:border-primary-700/50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/urls"
                className="group/action flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-700"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3 group-hover/action:scale-110 transition-transform duration-300">
                  <LinkIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">Create New URL</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Shorten and track</p>
                </div>
              </a>
              
              <a
                href="/groups"
                className="group/action flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-green-200 dark:hover:border-green-700"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 group-hover/action:scale-110 transition-transform duration-300">
                  <ChartBarIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300 font-medium text-sm">Create New Group</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Organize URLs</p>
                </div>
              </a>
              
              <a
                href="/profile"
                className="group/action flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-700"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover/action:scale-110 transition-transform duration-300">
                  <ClockIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-purple-700 dark:text-purple-300 font-medium text-sm">View Profile</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account settings</p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chatbot Component */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;
