import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { groupService } from '../services/groupService';
import { urlService } from '../services/urlService';
import toast from 'react-hot-toast';
import GroupDetailsModal from '../components/GroupDetailsModal';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [groupsData, urlsData] = await Promise.all([
        groupService.getGroups(),
        urlService.getShortUrls(),
      ]);
      setGroups(groupsData);
      setUrls(urlsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await groupService.createGroup(formData);
      toast.success('Group created successfully!');
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to create group');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await groupService.updateGroup(selectedGroup._id, formData);
      toast.success('Group updated successfully!');
      setShowEditModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to update group');
    }
  };

  const handleDelete = async () => {
    try {
      await groupService.deleteGroup(selectedGroup._id);
      toast.success('Group deleted successfully!');
      setShowDeleteModal(false);
      setSelectedGroup(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete group');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
    });
  };

  const openEditModal = (group) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (group) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const openGroupDetailsModal = (group) => {
    setSelectedGroup(group);
    setShowGroupDetailsModal(true);
  };

  const getGroupStats = (groupId) => {
    const groupUrls = urls.filter(url => 
      url.groupId?._id === groupId || url.groupId === groupId
    );
    console.log(`Group ${groupId} stats:`, { groupUrls, totalUrls: urls.length });
    const totalClicks = groupUrls.reduce((sum, url) => sum + (url.noOfClicks || url.clicks || 0), 0);
    return {
      urlCount: groupUrls.length,
      totalClicks,
    };
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize your URLs into groups for better management. Click the eye icon to view detailed analytics for each group.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Group
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => {
            const stats = getGroupStats(group._id);
            return (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <FolderIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openGroupDetailsModal(group)}
                      className="text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                      title="View group details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(group)}
                      className="text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                      title="Edit group"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(group)}
                      className="text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
                      title="Delete group"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {stats.urlCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">URLs</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.totalClicks}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Clicks</div>
                  </div>
                </div>

                {stats.urlCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recent URLs
                    </h4>
                    <div className="space-y-2">
                      {urls
                        .filter(url => url.groupId?._id === group._id || url.groupId === group._id)
                        .slice(0, 3)
                        .map((url) => (
                          <div key={url._id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-600 dark:text-gray-400 truncate max-w-32">
                                {url.name}
                              </span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-500">
                              {url.noOfClicks || url.clicks || 0} clicks
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No groups match your search' : 'No groups created yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary mt-4"
              >
                Create Your First Group
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Group</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Group Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        placeholder="Enter group name"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto sm:ml-3"
                    >
                      Create Group
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

      {/* Edit Group Modal */}
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
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Group</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Group Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        placeholder="Enter group name"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="btn-primary w-full sm:w-auto sm:ml-3"
                    >
                      Update Group
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Group</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Are you sure you want to delete "{selectedGroup?.name}"? This action cannot be undone.
                  </p>
                  {getGroupStats(selectedGroup?._id).urlCount > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ This group contains {getGroupStats(selectedGroup?._id).urlCount} URLs. 
                        Deleting the group will remove the group association from these URLs.
                      </p>
                    </div>
                  )}
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

      {/* Group Details Modal */}
      <GroupDetailsModal
        isOpen={showGroupDetailsModal}
        onClose={() => setShowGroupDetailsModal(false)}
        group={selectedGroup}
        urls={urls}
      />
    </div>
  );
};

export default Groups;
