import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { LinkIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const GoogleOAuthComplete = () => {
  const [formData, setFormData] = useState({
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [action, setAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthFromTokens } = useAuth();

  useEffect(() => {
    const actionParam = searchParams.get('action');
    
    if (actionParam === 'login') {
      // Handle login - user already exists
      handleExistingUserLogin();
    } else if (actionParam === 'signup') {
      // Handle signup - new user
      handleNewUserSignup();
    } else {
      // Invalid action, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleExistingUserLogin = () => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const expiresIn = searchParams.get('expiresIn');
    const refreshExpiresIn = searchParams.get('refreshExpiresIn');
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');
    const userName = searchParams.get('userName');
    const userContactNumber = searchParams.get('userContactNumber');
    const isGoogleUser = searchParams.get('isGoogleUser') === 'true';
    const emailVerified = searchParams.get('emailVerified') === 'true';

    if (accessToken && refreshToken) {
      const tokens = {
        accessToken,
        refreshToken,
        expiresIn: parseInt(expiresIn),
        refreshExpiresIn: parseInt(refreshExpiresIn),
      };

      const user = {
        id: userId,
        name: userName,
        email: userEmail,
        contactNumber: userContactNumber,
        isGoogleUser,
        emailVerified,
      };

      setAuthFromTokens(tokens, user);
      navigate('/dashboard');
    } else {
      navigate('/login?error=oauth_failed');
    }
  };

  const handleNewUserSignup = () => {
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const googleId = searchParams.get('googleId');
    
    if (email && name && googleId) {
      setUserInfo({ email, name, googleId });
      setAction('signup');
      setIsProcessing(false);
    } else {
      navigate('/login');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Contact number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !userInfo) return;

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/auth/google-oauth-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          googleId: userInfo.googleId,
          contactNumber: formData.contactNumber,
          password: formData.password,
        }),
      });

      const result = await response.json();
      
      if (result.success && result.tokens && result.user) {
        setAuthFromTokens(result.tokens, result.user);
        navigate('/dashboard');
      } else {
        setErrors({ general: result.message || 'Something went wrong' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Show loading while processing OAuth response
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Processing Google OAuth...</p>
        </div>
      </div>
    );
  }

  // Only show signup form for new users
  if (action !== 'signup' || !userInfo) {
    return null;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center justify-center group">
              <div className="h-14 w-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <LinkIcon className="h-7 w-7 text-white" />
              </div>
              <span className="ml-3 text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                URLShortner
              </span>
            </Link>
            <h2 className="mt-8 text-4xl font-bold text-gray-900 dark:text-white">
              Complete Your Profile
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Add your contact number and set a password
            </p>
            
            {/* User Info Display */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-semibold">Name:</span> {userInfo.name}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-semibold">Email:</span> {userInfo.email}
              </p>
            </div>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Create New Account
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Contact Number Field */}
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-400 ${
                    errors.contactNumber ? 'border-red-300 focus:ring-red-500' : 'hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  placeholder="Enter your contact number"
                />
                {errors.contactNumber && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.contactNumber}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-400 ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-400 ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.general}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  'Complete Registration'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Back to Login Link */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-base text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GoogleOAuthComplete;
