import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlService } from '../services/urlService';
import { groupService } from '../services/groupService';
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
  CalendarIcon,
  ClockIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const URLs = () => {
  const [urls, setUrls] = useState([]);
  const [groups, setGroups] = useState([]);
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
    groupId: '',
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
    fetchGroups();
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

  const fetchGroups = async () => {
    try {
      const groupsResult = await groupService.getGroups();
      setGroups(groupsResult || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
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
      groupId: '',
    });
  };

  const openEditModal = (url) => {
    if (!url) return;
    setSelectedUrl(url);
    setFormData({
      name: url.name || '',
      originalUrl: url.originalUrl || '',
      shortUrl: url.shortUrl || '',
      groupId: url.groupId?._id || url.groupId || '',
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">URLs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your shortened URLs and track their performance.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New URL
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search URLs by name or original URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* URLs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filteredUrls || []).length > 0 ? (
          (filteredUrls || []).map((url) => (
            <motion.div
              key={url._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* URL Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {url.name || 'Unnamed URL'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {url.originalUrl || 'No URL'}
                    </p>
                    {/* Group Badge */}
                    {url.groupId && (
                      <div className="flex items-center mt-2">
                        <UserGroupIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {url.groupId.name || 'Group'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                      <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* URL Content */}
              <div className="p-6 space-y-4">
                {/* Short URL */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Short URL</p>
                      <p className="text-sm font-mono text-primary-600 dark:text-primary-400 truncate">
                        {url.shortUrl ? `${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}` : 'No short URL'}
                      </p>
                    </div>
                    <button
                      onClick={() => url.shortUrl ? copyToClipboard(`${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}`) : toast.error('No short URL available')}
                      className="ml-2 p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                      title="Copy short URL"
                    >
                      <ClipboardIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {url.noOfClicks || url.clicks || 0} clicks
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {url.createdAt ? new Date(url.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openClickLogsModal(url)}
                      className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                      title="View Analytics"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(url)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      title="Edit URL"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(url)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      title="Delete URL"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Visit Button */}
                  {url.shortUrl && (
                    <a
                      href={`${import.meta.env.VITE_SHORT_URL_BASE || window.location.origin}/${url.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all duration-200"
                    >
                      <GlobeAltIcon className="h-3 w-3 mr-1" />
                      Visit
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <LinkIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No URLs found' : 'No URLs created yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first shortened URL'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Your First URL
                </button>
              )}
            </div>
          </div>
        )}
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
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleCreate}>
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center mb-6">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4">
                        <PlusIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create New URL</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add a new shortened URL to your collection</p>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
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
                          Custom Short URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.shortUrl}
                          onChange={(e) => setFormData({ ...formData, shortUrl: e.target.value })}
                          className="input-field"
                          placeholder="Leave empty for auto-generation"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Only letters, numbers, hyphens, and underscores (3-50 characters)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Group (Optional)
                        </label>
                        <select
                          value={formData.groupId}
                          onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                          className="input-field"
                        >
                          <option value="">No Group</option>
                          {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Organize your URLs by grouping them together
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto sm:ml-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleEdit}>
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center mb-6">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <PencilIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit URL</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your shortened URL details</p>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
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
                          Custom Short URL (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.shortUrl}
                          onChange={(e) => setFormData({ ...formData, shortUrl: e.target.value })}
                          className="input-field"
                          placeholder="Leave empty for auto-generation"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Only letters, numbers, hyphens, and underscores (3-50 characters)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Group (Optional)
                        </label>
                        <select
                          value={formData.groupId}
                          onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                          className="input-field"
                        >
                          <option value="">No Group</option>
                          {groups.map((group) => (
                            <option key={group._id} value={group._id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Organize your URLs by grouping them together
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto sm:ml-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                      <TrashIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delete URL</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Are you sure you want to delete "<span className="font-medium text-gray-900 dark:text-white">{selectedUrl?.name || 'this URL'}</span>"? This action cannot be undone.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleDelete}
                    className="btn-danger w-full sm:w-auto sm:ml-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Delete URL
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
