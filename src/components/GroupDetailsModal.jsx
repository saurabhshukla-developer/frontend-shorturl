import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlService } from '../services/urlService';
import toast from 'react-hot-toast';
import ClickLogsModal from './ClickLogsModal';
import {
  XMarkIcon,
  LinkIcon,
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const GroupDetailsModal = ({ isOpen, onClose, group, urls }) => {
  const [loading, setLoading] = useState(false);
  const [showClickLogsModal, setShowClickLogsModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);

  const groupUrls = useMemo(() => {
    if (isOpen && group && urls && Array.isArray(urls)) {
      // Filter URLs that belong to this group
      return urls.filter(url => 
        url && (url.groupId?._id === group._id || url.groupId === group._id)
      );
    }
    return [];
  }, [isOpen, group, urls]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const openClickLogsModal = (url) => {
    setSelectedUrl(url);
    setShowClickLogsModal(true);
  };

  const stats = useMemo(() => {
    if (!groupUrls.length) return { totalClicks: 0, totalUrls: 0, avgClicks: 0 };
    
    const totalClicks = groupUrls.reduce((sum, url) => {
      const clicks = url.noOfClicks || url.clicks || 0;
      return sum + clicks;
    }, 0);
    const totalUrls = groupUrls.length;
    const avgClicks = totalClicks / totalUrls;
    
    return { totalClicks, totalUrls, avgClicks: Math.round(avgClicks * 100) / 100 };
  }, [groupUrls]);

  if (!isOpen || !group || !urls) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="group-details-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                      <UserGroupIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Group Details & Analytics</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Group Stats */}
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                        <LinkIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total URLs</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalUrls}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                        <EyeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Clicks</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalClicks}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                        <ChartBarIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg. Clicks</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.avgClicks}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* URLs List */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">URLs in this Group</h4>
                  
                  {groupUrls.length > 0 ? (
                    <div className="space-y-4">
                      {groupUrls.map((url, index) => {
                        // Ensure we have a stable, unique key
                        const urlKey = url._id || `url-${index}`;
                        const urlName = url.name || 'unnamed';
                        const uniqueKey = `${urlKey}-${urlName}-${index}`;
                        
                        return (
                          <motion.div
                            key={uniqueKey}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                          >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-2">
                                <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                                  <LinkIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {url.name || 'Unnamed URL'}
                                  </h5>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {url.originalUrl}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="ml-11 space-y-2">
                                {/* Short URL */}
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Short:</span>
                                  <span className="text-xs font-mono text-primary-600 dark:text-primary-400">
                                    {url.shortUrl ? `${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}` : 'No short URL'}
                                  </span>
                                  <button
                                    onClick={() => url.shortUrl ? copyToClipboard(`${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}`) : null}
                                    className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-all duration-200"
                                    title="Copy short URL"
                                  >
                                    <ClipboardIcon className="h-3 w-3" />
                                  </button>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <EyeIcon className="h-3 w-3" />
                                    <span>{url.noOfClicks || url.clicks || 0} clicks</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>{url.createdAt ? new Date(url.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => openClickLogsModal(url)}
                                className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                                title="View Analytics"
                              >
                                <ChartBarIcon className="h-4 w-4" />
                              </button>
                              
                              {url.shortUrl && (
                                <a
                                  href={`${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                                  title="Visit URL"
                                >
                                  <GlobeAltIcon className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <LinkIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No URLs in this group</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        URLs assigned to this group will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Click Logs Modal */}
      <ClickLogsModal
        isOpen={showClickLogsModal}
        onClose={() => setShowClickLogsModal(false)}
        urlId={selectedUrl?._id}
        urlName={selectedUrl?.name}
      />
    </AnimatePresence>
  );
};

export default GroupDetailsModal;
