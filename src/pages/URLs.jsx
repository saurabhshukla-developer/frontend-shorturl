import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlService } from '../services/urlService';
import toast from 'react-hot-toast';
import ClickLogsModal from '../components/ClickLogsModal';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  EyeIcon,
  ClipboardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const URLs = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClickLogsModal, setShowClickLogsModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    originalUrl: '',
    shortUrl: '',
  });

  // Debug logging for modal state
  useEffect(() => {
    console.log('URLs - showClickLogsModal changed:', showClickLogsModal);
    console.log('URLs - Stack trace:', new Error().stack);
  }, [showClickLogsModal]);

  useEffect(() => {
    console.log('URLs - selectedUrl changed:', selectedUrl);
  }, [selectedUrl]);

  // Prevent modal from closing unexpectedly
  useEffect(() => {
    if (showClickLogsModal && selectedUrl) {
      console.log('URLs - Modal should be open, ensuring it stays open');
    }
  }, [showClickLogsModal, selectedUrl]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const urlsResult = await urlService.getShortUrls();
      
      if (urlsResult && Array.isArray(urlsResult)) {
        setUrls(urlsResult);
      } else {
        console.error('Failed to fetch URLs:', urlsResult);
        setUrls([]);
        toast.error('Failed to fetch URLs');
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      toast.error('Failed to fetch URLs');
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('URL name is required');
      return;
    }
    
    if (!formData.originalUrl.trim()) {
      toast.error('Original URL is required');
      return;
    }
    
    try {
      console.log('Submitting form data:', formData);
      await urlService.createShortUrl(formData);
      toast.success('URL created successfully!');
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating URL:', error);
      toast.error(error.message || 'Failed to create URL');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await urlService.updateShortUrl(selectedUrl._id, formData);
      toast.success('URL updated successfully!');
      setShowEditModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to update URL');
    }
  };

  const handleDelete = async () => {
    try {
      await urlService.deleteShortUrl(selectedUrl._id);
      toast.success('URL deleted successfully!');
      setShowDeleteModal(false);
      setSelectedUrl(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete URL');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      originalUrl: '',
      shortUrl: '',
    });
  };

  const openEditModal = (url) => {
    if (!url) return;
    setSelectedUrl(url);
    setFormData({
      name: url.name || '',
      originalUrl: url.originalUrl || '',
      shortUrl: url.shortUrl || '',
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (url) => {
    setSelectedUrl(url);
    setShowDeleteModal(true);
  };

  const openClickLogsModal = (url) => {
    console.log('URLs - Opening click logs modal for URL:', url);
    setSelectedUrl(url);
    setShowClickLogsModal(true);
    console.log('URLs - Modal state set to true');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const filteredUrls = (urls || []).filter(url => {
    const matchesSearch = url.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">URLs</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your shortened URLs and track their performance.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New URL
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
                <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* URLs List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  URL Details
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {(filteredUrls || []).length > 0 ? (
                (filteredUrls || []).map((url) => (
                  <motion.tr
                    key={url._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                          <LinkIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {url.name || 'Unnamed URL'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {url.originalUrl || 'No URL'}
                          </div>
                          <div className="text-xs text-primary-600 dark:text-primary-400 font-mono">
                            {url.shortUrl ? `${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}` : 'No short URL'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {url.noOfClicks || url.clicks || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {url.createdAt ? new Date(url.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => url.shortUrl ? copyToClipboard(`${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}`) : toast.error('No short URL available')}
                          className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                          title="Copy short URL"
                        >
                          <ClipboardIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openClickLogsModal(url)}
                          className="text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                          title="View Click Analytics"
                        >
                          <ChartBarIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(url)}
                          className="text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                          title="Edit URL"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(url)}
                          className="text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                          title="Delete URL"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No URLs match your search' : 'No URLs created yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create URL Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)} />
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleCreate}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New URL</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          URL Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field"
                          placeholder="Enter URL name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Original URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.originalUrl}
                          onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                          className="input-field"
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Desired Short URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.shortUrl}
                          onChange={(e) => setFormData({ ...formData, shortUrl: e.target.value })}
                          className="input-field"
                          placeholder="Leave empty for auto-generation"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Only letters, numbers, hyphens, and underscores (3-50 characters)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto sm:ml-3"
                    >
                      Create URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit URL Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)} />
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleEdit}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit URL</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          URL Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field"
                          placeholder="Enter URL name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Original URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.originalUrl}
                          onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                          className="input-field"
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Desired Short URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.shortUrl}
                          onChange={(e) => setFormData({ ...formData, shortUrl: e.target.value })}
                          className="input-field"
                          placeholder="Leave empty for auto-generation"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Only letters, numbers, hyphens, and underscores (3-50 characters)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto sm:ml-3"
                    >
                      Update URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)} />
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete URL</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Are you sure you want to delete "{selectedUrl?.name || 'this URL'}"? This action cannot be undone.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleDelete}
                    className="btn-danger w-full sm:w-auto sm:ml-3"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Logs Modal */}
      <ClickLogsModal
        isOpen={showClickLogsModal}
        onClose={() => setShowClickLogsModal(false)}
        urlId={selectedUrl?._id}
        urlName={selectedUrl?.name}
      />
    </div>
  );
};

export default URLs;
