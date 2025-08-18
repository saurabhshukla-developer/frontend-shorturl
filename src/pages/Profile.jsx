import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contactNumber: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (result.success) {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information and security settings.</p>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                {isEditing ? (
                  <>
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Contact Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.contactNumber}
                      onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
                      className="input-field"
                      required
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">{user.contactNumber}</span>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex items-center space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <CheckIcon className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>

        {/* Security Card */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Account Security
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Your account is protected with strong authentication and encryption.
                </p>
              </div>
              
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <KeyIcon className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Account Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Member Since</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Last Login</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Active
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Account Status</div>
          </div>
        </div>
      </motion.div>

      {/* Password Change Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showPasswordModal ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-50 overflow-y-auto ${showPasswordModal ? 'block' : 'hidden'}`}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPasswordModal(false)} />
          
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form onSubmit={handlePasswordChange}>
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
                
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="input-field pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="input-field pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="input-field pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto sm:ml-3"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    resetPasswordForm();
                  }}
                  className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
