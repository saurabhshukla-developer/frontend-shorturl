import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { EnvelopeIcon, LinkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { forgotPassword } = useAuth();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSubmitted(true);
      }
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full space-y-8 text-center"
          >
            {/* Header */}
            <div>
              <Link to="/" className="inline-flex items-center justify-center">
                <div className="h-12 w-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">URLShortner</span>
              </Link>
            </div>

            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                Check Your Email
              </h2>
              <p className="text-green-600 dark:text-green-300 mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-green-500 dark:text-green-400">
                Click the link in the email to reset your password. The link will expire in 10 minutes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/login"
                className="btn-primary w-full flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Login
              </Link>
              
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="btn-secondary w-full"
              >
                Send Another Email
              </button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center">
              <div className="h-12 w-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">URLShortner</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-field pl-10 ${
                    error ? 'border-red-300 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 inline mr-1" />
                Back to Login
              </Link>
            </div>
          </motion.form>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
