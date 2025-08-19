import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { EyeIcon, EyeSlashIcon, LinkIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { processError, categorizeErrorsForDisplay } from '../utils/errorHandler.js';
import ErrorDisplay from '../components/ErrorDisplay';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  // Debug: Monitor errors state changes
  useEffect(() => {
    console.log('Errors state changed:', errors);
  }, [errors]);

  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[+]?[\d\s\-\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/login');
      } else {
        // Handle error from AuthContext result
        if (result.error) {
          // Debug: Log the error structure
          console.log('=== REGISTRATION ERROR DEBUG ===');
          console.log('Result error:', result.error);
          console.log('Error type:', result.error.type);
          console.log('Error details:', result.error.details);
          console.log('Error fieldErrors:', result.error.fieldErrors);
          console.log('=== END DEBUG ===');
          
          // Handle backend validation errors by mapping them to specific fields
          if (result.error.type === 'CONFLICT_ERROR' && result.error.details?.field) {
            setErrors(prev => ({ ...prev, [result.error.details.field]: result.error.message }));
            return;
          }
          
          // Handle CONFLICT_ERROR with fieldErrors array
          if (result.error.type === 'CONFLICT_ERROR' && result.error.fieldErrors && result.error.fieldErrors.length > 0) {
            const fieldErrors = {};
            result.error.fieldErrors.forEach(fieldError => {
              if (fieldError.field && fieldError.message) {
                fieldErrors[fieldError.field] = fieldError.message;
              }
            });
            setErrors(prev => ({ ...prev, ...fieldErrors }));
            return;
          }
          
          // Handle CONFLICT_ERROR for email already registered (fallback)
          if (result.error.type === 'CONFLICT_ERROR' && result.error.message && result.error.message.toLowerCase().includes('email')) {
            console.log('Setting email field error:', result.error.message);
            setErrors(prev => {
              const newErrors = { ...prev, email: result.error.message };
              console.log('New errors state:', newErrors);
              return newErrors;
            });
            return;
          }
          
          // Handle CONFLICT_ERROR for contact number already registered (fallback)
          if (result.error.type === 'CONFLICT_ERROR' && result.error.message && result.error.message.toLowerCase().includes('contact')) {
            setErrors(prev => ({ ...prev, contactNumber: result.error.message }));
            return;
          }
          
          const processedError = processError(result.error);
          const { fieldErrors, generalError } = categorizeErrorsForDisplay(processedError);
          
          // Set field-specific errors
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...fieldErrors }));
          }
          
          // Set general error if any
          if (generalError) {
            setErrors(prev => ({ ...prev, general: generalError }));
          }
          
          // If no errors were set, show the original error message as general error
          if (Object.keys(fieldErrors).length === 0 && !generalError) {
            setErrors({ general: result.error.message || 'Registration failed. Please try again.' });
          }
        }
      }
    } catch (error) {
      // Debug: Log the error structure
      console.log('=== REGISTRATION ERROR DEBUG ===');
      console.log('Original error:', error);
      console.log('Error type:', error.type);
      console.log('Error details:', error.details);
      console.log('Error fieldErrors:', error.fieldErrors);
      console.log('=== END DEBUG ===');
      
      // Handle backend validation errors by mapping them to specific fields
      if (error.type === 'CONFLICT_ERROR' && error.details?.field) {
        setErrors(prev => ({ ...prev, [error.details.field]: error.message }));
        return;
      }
      
      // Handle CONFLICT_ERROR with fieldErrors array
      if (error.type === 'CONFLICT_ERROR' && error.fieldErrors && error.fieldErrors.length > 0) {
        const fieldErrors = {};
        error.fieldErrors.forEach(fieldError => {
          if (fieldError.field && fieldError.message) {
            fieldErrors[fieldError.field] = fieldError.message;
          }
        });
        setErrors(prev => ({ ...prev, ...fieldErrors }));
        return;
      }
      
      // Handle CONFLICT_ERROR for email already registered (fallback)
      if (error.type === 'CONFLICT_ERROR' && error.message && error.message.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: error.message }));
        return;
      }
      
      // Handle CONFLICT_ERROR for contact number already registered (fallback)
      if (error.type === 'CONFLICT_ERROR' && error.message && error.message.toLowerCase().includes('contact')) {
        setErrors(prev => ({ ...prev, contactNumber: error.message }));
        return;
      }
      
      const processedError = processError(error);
      const { fieldErrors, generalError } = categorizeErrorsForDisplay(processedError);
      
      // Set field-specific errors
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      }
      
      // Set general error if any
      if (generalError) {
        setErrors(prev => ({ ...prev, general: generalError }));
      }
      
      // If no errors were set, show the original error message as general error
      if (Object.keys(fieldErrors).length === 0 && !generalError) {
        setErrors({ general: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setErrors({}); // Clear errors before retry
      await handleSubmit(new Event('submit')); // Trigger form submission
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }

    // Reset retry count when user makes changes
    if (retryCount > 0) {
      setRetryCount(0);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validate specific field on blur
    let fieldError = '';
    
    switch (name) {
      case 'name':
        if (!value) {
          fieldError = 'Name is required';
        } else if (value.length < 2) {
          fieldError = 'Name must be at least 2 characters';
        } else if (value.length > 50) {
          fieldError = 'Name cannot exceed 50 characters';
        }
        break;
      case 'email':
        if (!value) {
          fieldError = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;
      case 'contactNumber':
        if (!value) {
          fieldError = 'Contact number is required';
        } else if (!/^[+]?[\d\s\-\(\)]+$/.test(value)) {
          fieldError = 'Please enter a valid contact number';
        }
        break;
      case 'password':
        if (!value) {
          fieldError = 'Password is required';
        } else if (value.length < 8) {
          fieldError = 'Password must be at least 8 characters';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          fieldError = 'Please confirm your password';
        } else if (value !== formData.password) {
          fieldError = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    if (fieldError) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to backend Google OAuth endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

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
              Create your account
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Start shortening URLs and tracking analytics
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8"
          >


            {/* Google Signup Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
            >
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Form Requirements Helper */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Requirements:</strong> Name (2-50 chars), valid email, contact number, password (min 8 chars)
                </p>
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500 ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : formData.name && formData.name.length >= 2 && formData.name.length <= 50
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formData.name && formData.name.length >= 2 && formData.name.length <= 50 && !errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500 ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

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
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500 ${
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
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500 ${
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
                
                {/* Password Strength Indicator */}
                {formData.password && !errors.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`h-2 flex-1 rounded-full ${
                        formData.password.length < 8 ? 'bg-gray-200 dark:bg-gray-600' : 'bg-green-500'
                      }`}></div>
                      <div className={`h-2 flex-1 rounded-full ${
                        formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                      }`}></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.password.length < 8 
                        ? `At least ${8 - formData.password.length} more characters needed`
                        : 'Password meets requirements'
                      }
                    </p>
                  </div>
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
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-500 ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 focus:ring-blue-500'
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
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && !errors.confirmPassword && (
                    <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                      {formData.password === formData.confirmPassword ? (
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
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
                
                {/* Password Match Status */}
                {formData.confirmPassword && !errors.confirmPassword && (
                  <p className={`mt-2 text-xs ${
                    formData.password === formData.confirmPassword 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formData.password === formData.confirmPassword 
                      ? '✓ Passwords match' 
                      : '✗ Passwords do not match'
                    }
                  </p>
                )}
              </div>



              {/* Form Validation Summary */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    Object.keys(errors).length === 0 && 
                    formData.name && formData.email && formData.contactNumber && 
                    formData.password && formData.confirmPassword &&
                    formData.password === formData.confirmPassword
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {Object.keys(errors).length === 0 && 
                     formData.name && formData.email && formData.contactNumber && 
                     formData.password && formData.confirmPassword &&
                     formData.password === formData.confirmPassword
                      ? 'Ready to submit'
                      : Object.keys(errors).length > 0 
                        ? 'Please fix the errors above'
                        : 'Please complete all fields'
                    }
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center ${formData.name && formData.name.length >= 2 && formData.name.length <= 50 && !errors.name ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formData.name && formData.name.length >= 2 && formData.name.length <= 50 && !errors.name ? '✓' : '○'} Name
                  </div>
                  <div className={`flex items-center ${formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) && !errors.email ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formData.email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) && !errors.email ? '✓' : '○'} Email
                  </div>
                  <div className={`flex items-center ${formData.contactNumber && /^[+]?[\d\s\-\(\)]+$/.test(formData.contactNumber) && !errors.contactNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formData.contactNumber && /^[+]?[\d\s\-\(\)]+$/.test(formData.contactNumber) && !errors.contactNumber ? '✓' : '○'} Contact
                  </div>
                  <div className={`flex items-center ${formData.password && formData.password.length >= 8 && !errors.password ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formData.password && formData.password.length >= 8 && !errors.password ? '✓' : '○'} Password
                  </div>
                  <div className={`flex items-center ${formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword ? '✓' : '○'} Confirm
                  </div>
                </div>
              </div>

              {/* Common Form Error */}
              {errors.general && (
                <ErrorDisplay
                  error={{ message: errors.general }}
                  onRetry={handleRetry}
                  retryCount={retryCount}
                  maxRetries={maxRetries}
                  showRetry={retryCount < maxRetries}
                />
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
                  'Create Account'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Sign In Link */}
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

export default Register;
