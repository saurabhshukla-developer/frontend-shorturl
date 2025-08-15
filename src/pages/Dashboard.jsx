import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import { urlService } from '../services/urlService';
import { groupService } from '../services/groupService';
import {
  LinkIcon,
  ChartBarIcon,
  EyeIcon,
  GlobeAltIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentUrls, setRecentUrls] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, analyticsData, urlsData, groupsData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getAnalytics(),
          urlService.getShortUrls(),
          groupService.getGroups(),
        ]);

        setStats(statsData);
        setAnalytics(analyticsData);
        setRecentUrls(urlsData.slice(0, 5));
        setRecentGroups(groupsData.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
                {stats?.totalUrls || 0}
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
                {stats?.totalClicks || 0}
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
                {stats?.totalGroups || 0}
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
                {stats?.averageCTR ? `${stats.averageCTR.toFixed(1)}%` : '0%'}
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Click Trends (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.clickTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing URLs</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.topUrls || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
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
                      {url.originalUrl}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {url.clicks || 0} clicks
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(url.createdAt).toLocaleDateString()}
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
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(group.createdAt).toLocaleDateString()}
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
