import { motion } from 'framer-motion';
import { XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { getErrorIcon, getErrorColorScheme } from '../utils/errorHandler';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  onDismiss, 
  retryCount = 0, 
  maxRetries = 3,
  showRetry = true,
  className = "",
  variant = "error" // error, warning, info
}) => {
  if (!error) return null;

  const colorScheme = getErrorColorScheme(error);
  const icon = getErrorIcon(error);

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-700 dark:text-yellow-300',
          icon: 'text-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'text-blue-500'
        };
      default:
        return colorScheme;
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`p-4 rounded-lg border ${styles.bg} ${styles.border} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {variant === 'warning' ? (
            <ExclamationTriangleIcon className="h-5 w-5" />
          ) : variant === 'info' ? (
            <InformationCircleIcon className="h-5 w-5" />
          ) : (
            <span className="text-lg">{icon}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${styles.text}`}>
                {error.message || error}
              </p>
              
              {/* Retry count indicator */}
              {retryCount > 0 && retryCount < maxRetries && (
                <p className={`text-xs ${styles.text} mt-1 opacity-75`}>
                  Attempt {retryCount} of {maxRetries}
                </p>
              )}
              
              {/* Additional error details */}
              {error.details && (
                <div className="mt-2 text-xs opacity-75">
                  {typeof error.details === 'string' ? (
                    <p className={styles.text}>{error.details}</p>
                  ) : (
                    <pre className={`text-xs ${styles.text} whitespace-pre-wrap`}>
                      {JSON.stringify(error.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2 ml-3">
              {/* Retry button */}
              {showRetry && onRetry && retryCount < maxRetries && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    variant === 'warning' 
                      ? 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-700 dark:text-yellow-300'
                      : variant === 'info'
                      ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-300'
                      : 'bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-300'
                  }`}
                  aria-label="Retry"
                >
                  Retry
                </button>
              )}
              
              {/* Dismiss button */}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className={`p-1 rounded-md transition-colors ${
                    variant === 'warning'
                      ? 'text-yellow-400 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800'
                      : variant === 'info'
                      ? 'text-blue-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800'
                      : 'text-red-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-800'
                  }`}
                  aria-label="Dismiss"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorDisplay;
